import { TinyColor } from "@ctrl/tinycolor";
import { NextPage } from "next";
import { DragEvent } from "react";
import { ReactNode, useEffect, useState } from "react";

import CrossHeader from "@/components/elements/pages/editor/timeline/CrossHeader";
import DaysHeader from "@/components/elements/pages/editor/timeline/DaysHeader";
import TimelineItems from "@/components/elements/pages/editor/timeline/TimelineItems";
import TimelineViewer from "@/components/elements/pages/editor/timeline/TimelineViewer";
import { Arrays } from "@/models/Arrays";
import { Calendars } from "@/models/Calendars";
import Colors from "@/models/Colors";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { Design } from "@/models/data/Design";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { EditProps } from "@/models/data/props/EditProps";
import { AnyTimeline, GroupTimeline, TaskTimeline, Theme, TimelineId, TimelineKind } from "@/models/data/Setting";
import { TimelineItem } from "@/models/data/TimelineItem";
import { WorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Designs } from "@/models/Designs";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";


interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {

	const workRangesCache = new Map<TimelineId, WorkRange>();

	let hoverTimeline: AnyTimeline | null = null;
	let activeTimeline: AnyTimeline | null = null;

	const [rootChildren, setRootChildren] = useState([...props.editData.setting.rootTimeline.children]);
	const [timelineStore, setTimelineStore] = useState<TimelineStore>(createTimelineStore(new Map(), new Map()));
	const [draggingTimeline, setDraggingTimeline] = useState<DraggingTimeline | null>(null);
	const [dropTimeline, setDropTimeline] = useState<DropTimeline | null>(null);
	const [selectingBeginDate, setSelectingBeginDate] = useState<SelectingBeginDate | null>(null);

	const calendarInfo = Calendars.createCalendarInfo(props.editData.setting.timeZone, props.editData.setting.calendar);

	// 初回のみ
	useEffect(() => {
		updateRelations();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		updateRelations();
	}, [rootChildren]); // eslint-disable-line react-hooks/exhaustive-deps

	function createTimelineStore(totalItems: ReadonlyMap<TimelineId, AnyTimeline>, changedItems: ReadonlyMap<TimelineId, TimelineItem>): TimelineStore {

		for (const [k, v] of changedItems) {
			if (v.workRange) {
				workRangesCache.set(k, v.workRange);
			}
		}

		const timelineSequence = Timelines.flat(props.editData.setting.rootTimeline.children);

		const result: TimelineStore = {
			rootGroupTimeline: props.editData.setting.rootTimeline,
			totalItemMap: totalItems,
			sequenceItems: timelineSequence,
			indexItemMap: Timelines.toIndexes(timelineSequence),

			changedItemMap: changedItems,
			workRanges: workRangesCache,

			hoverItem: hoverTimeline,
			activeItem: activeTimeline,

			addEmptyTimeline: handleAddEmptyTimeline,
			addNewTimeline: handleAddNewTimeline,
			updateTimeline: handleUpdateTimeline,
			moveTimeline: handleMoveTimeline,
			removeTimeline: handleRemoveTimeline,

			setHoverTimeline: handleSetHoverTimeline,
			setActiveTimeline: handleSetActiveTimeline,

			startDragTimeline: handleStartDragTimeline,
		};

		return result;
	}

	function updateRelations() {
		console.debug("全体へ通知");

		const timelineMap = Timelines.getTimelinesMap(props.editData.setting.rootTimeline);
		const workRanges = Timelines.getWorkRanges([...timelineMap.values()], props.editData.setting.calendar.holiday, props.editData.setting.recursive, calendarInfo.timeZone);

		const changedItems = new Map(
			[...timelineMap.entries()]
				.filter(([k, _]) => timelineMap.has(k))
				.map(([k, v]) => {
					const item: TimelineItem = {
						timeline: v,
						workRange: workRanges.get(k),
					};

					return [k, item];
				})
		);
		const store = createTimelineStore(timelineMap, changedItems);
		setTimelineStore(store);
	}

	function fireDropTimeline(dropTimeline: DropTimeline) {
		console.debug("FIRE");

		const sourceIsRoot = Settings.maybeRootTimeline(dropTimeline.sourceGroupTimeline);
		const destinationIsRoot = Settings.maybeRootTimeline(dropTimeline.destinationGroupTimeline);
		const sameGroup = dropTimeline.sourceGroupTimeline.id === dropTimeline.destinationGroupTimeline.id;

		if (sameGroup) {
			// 同一グループ内移動
			const newChildren = [...dropTimeline.sourceGroupTimeline.children];
			Arrays.moveIndexInPlace(newChildren, dropTimeline.sourceIndex, dropTimeline.destinationIndex);

			if (sourceIsRoot) {
				// 最上位は設定だけ変えて後続で状態変更
				props.editData.setting.rootTimeline.children = newChildren;
			} else {
				// 子孫は連携だけ
				timelineStore.updateTimeline({
					...dropTimeline.sourceGroupTimeline,
					children: newChildren,
				});
			}
		} else {
			// グループから破棄
			const newSourceChildren = dropTimeline.sourceGroupTimeline.children.filter(a => a.id !== dropTimeline.timeline.id);

			// 別グループに追加
			const newDestinationChildren = [...dropTimeline.destinationGroupTimeline.children];
			newDestinationChildren.splice(dropTimeline.destinationIndex, 0, dropTimeline.timeline);

			if (sourceIsRoot) {
				props.editData.setting.rootTimeline.children = newSourceChildren;
			} else {
				timelineStore.updateTimeline({
					...dropTimeline.sourceGroupTimeline,
					children: newSourceChildren,
				});
			}
			if (destinationIsRoot) {
				props.editData.setting.rootTimeline.children = newDestinationChildren;
			} else {
				timelineStore.updateTimeline({
					...dropTimeline.destinationGroupTimeline,
					children: newDestinationChildren,
				});
			}
		}

		setDropTimeline(null);
		setDraggingTimeline(null);

		setRootChildren(props.editData.setting.rootTimeline.children);
	}

	function handleSetPointerTimeline(timeline: AnyTimeline | null, property: "isHover" | "isActive"): void {
		const changedItems = new Map<TimelineId, TimelineItem>();

		const currentTimeline = property === "isHover"
			? hoverTimeline
			: activeTimeline
			;

		if (currentTimeline && currentTimeline?.id !== timeline?.id) {
			changedItems.set(currentTimeline.id, {
				timeline: currentTimeline,
				[property]: false,
			});
		}

		if (timeline) {
			changedItems.set(timeline.id, {
				timeline: timeline,
				[property]: true,
			});
		}

		if (property === "isHover") {
			hoverTimeline = timeline;
		} else {
			activeTimeline = timeline;
		}

		const timelineMap = Timelines.getTimelinesMap(props.editData.setting.rootTimeline);

		const store = createTimelineStore(timelineMap, changedItems);

		setTimelineStore(store);
	}

	function handleSetHoverTimeline(timeline: AnyTimeline | null): void {
		handleSetPointerTimeline(
			timeline,
			"isHover"
		);
	}

	function handleSetActiveTimeline(timeline: AnyTimeline | null): void {
		handleSetPointerTimeline(
			timeline,
			"isActive"
		);
	}

	function handleStartDragTimeline(event: DragEvent, sourceTimeline: AnyTimeline): void {
		console.debug(event, sourceTimeline);

		const dragging: DraggingTimeline = {
			sourceTimeline: sourceTimeline,
			onDragEnd: (ev) => {
				console.debug("END", ev, sourceTimeline);
				setDraggingTimeline(null);
			},
			onDragEnter: (ev, targetTimeline) => {
				console.debug("ENTER", ev, targetTimeline);
			},
			onDragOver: (ev, targetTimeline, callback) => {
				console.debug("OVER", ev, targetTimeline);
				// 自分自身への移動は抑制
				if (targetTimeline.id === sourceTimeline.id) {
					return;
				}

				if (Settings.maybeGroupTimeline(sourceTimeline)) {
					// 自分がグループの場合、自分より下への移動は抑制
					const map = Timelines.getTimelinesMap(sourceTimeline);
					if (map.has(targetTimeline.id)) {
						return;
					}
				}

				// 自身のグループへの移動は抑制(どうすりゃいいのか正解が分からん)
				if (Settings.maybeGroupTimeline(targetTimeline)) {
					if (targetTimeline.children.find(a => a.id === sourceTimeline.id)) {
						return;
					}
				}

				callback(dragging);
				ev.preventDefault();
			},
			onDragLeave: (ev, targetTimeline, callback) => {
				console.debug("LEAVE", ev, targetTimeline);
				callback(dragging);
			},
			onDrop: (ev, targetTimeline) => {
				console.debug("DROP", ev, targetTimeline);

				const sourceGroupTimelines = Timelines.getParentGroups(sourceTimeline, props.editData.setting.rootTimeline);
				const targetGroupTimelines = Timelines.getParentGroups(targetTimeline, props.editData.setting.rootTimeline);

				if (!sourceGroupTimelines.length || !targetGroupTimelines.length) {
					// ツリーにいない場合はどうにもならん
					throw new Error(JSON.stringify({
						sourceGroupTimelines,
						targetGroupTimelines,
					}));
				}

				// // 最上位から最上位
				// if (sourceGroupTimelines.length === 1 && targetGroupTimelines.length === 1) {
				// 	const sourceIndex = props.editData.setting.rootTimeline.children.findIndex(a => a.id === sourceTimeline.id);
				// 	const destinationIndex = props.editData.setting.rootTimeline.children.findIndex(a => a.id === targetTimeline.id);
				// 	if (sourceIndex === -1 || destinationIndex === -1) {
				// 		throw new Error(JSON.stringify({
				// 			sourceIndex,
				// 			destinationIndex,
				// 		}));
				// 	}

				// 	fireDropTimeline({
				// 		timeline: sourceTimeline,
				// 		sourceGroupTimeline: null,
				// 		destinationGroupTimeline: null,
				// 		sourceIndex: sourceIndex,
				// 		destinationIndex: destinationIndex,
				// 	});
				// 	return;
				// }

				// 対象がグループの場合、そのグループへ移動
				if (Settings.maybeGroupTimeline(targetTimeline)) {
					const sourceGroupTimeline = sourceGroupTimelines[sourceGroupTimelines.length - 1];
					const sourceIndex = sourceGroupTimeline.children.findIndex(a => a.id === sourceTimeline.id);

					fireDropTimeline({
						timeline: sourceTimeline,
						sourceGroupTimeline: sourceGroupTimeline,
						sourceIndex: sourceIndex,
						destinationGroupTimeline: targetTimeline,
						destinationIndex: -1,
					});
					return;
				}

				// 単純移動
				const sourceNodes = sourceGroupTimelines[sourceGroupTimelines.length - 1].children;
				const sourceIndex = sourceNodes.findIndex(a => a.id === sourceTimeline.id);
				const destinationNodes = targetGroupTimelines[targetGroupTimelines.length - 1].children;
				const destinationIndex = destinationNodes.findIndex(a => a.id === targetTimeline.id);
				fireDropTimeline({
					timeline: sourceTimeline,
					sourceGroupTimeline: sourceGroupTimelines[sourceGroupTimelines.length - 1],
					sourceIndex: sourceIndex,
					destinationGroupTimeline: targetGroupTimelines[targetGroupTimelines.length - 1],
					destinationIndex: destinationIndex,
				});
			}
		};

		setDraggingTimeline(dragging);
	}

	function handleAddEmptyTimeline(baseTimeline: AnyTimeline, options: NewTimelineOptions): void {
		const newTimeline = createEmptyTimeline(options.timelineKind);

		handleAddNewTimeline(baseTimeline, newTimeline, options.position);
	}

	function handleAddNewTimeline(baseTimeline: AnyTimeline, newTimeline: AnyTimeline, position: NewTimelinePosition): void {
		// 将来追加した場合の安全弁
		if (position !== NewTimelinePosition.Next) {
			throw new Error(position);
		}

		const groups = Timelines.getParentGroups(baseTimeline, props.editData.setting.rootTimeline);

		let parent: GroupTimeline;
		if (Settings.maybeGroupTimeline(baseTimeline)) {
			parent = baseTimeline;
		} else {
			parent = Arrays.last(groups);
		}

		if (Settings.maybeGroupTimeline(baseTimeline)) {
			// グループの場合、そのグループの末っ子に設定
			parent.children = [
				...parent.children,
				newTimeline,
			];
		} else {
			// タスクの場合、次に設定する
			const currentIndex = parent.children.findIndex(a => a.id === baseTimeline.id);
			const newChildren = [...parent.children];
			newChildren.splice(currentIndex + 1, 0, newTimeline);
			parent.children = newChildren;
		}

		if (groups.length === 1) {
			setRootChildren(parent.children);
			return;
		}

		updateRelations();
	}

	function handleUpdateTimeline(timeline: AnyTimeline): void {
		//
		const source = Timelines.findTimeline(timeline.id, rootChildren);
		if (!source) {
			return;
		}
		if (source.kind !== timeline.kind) {
			throw new Error();
		}

		const timelineMap = Timelines.getTimelinesMap({
			...Timelines.createRootGroup(),
			children: rootChildren,
		});

		const prevSource = { ...source };
		Object.assign(source, timeline);
		const timelineItems = new Array<TimelineItem>();
		timelineItems.push({
			timeline: source
		});

		if (Settings.maybeGroupTimeline(timeline)) {
			/*
			const prevGroupSource = prevSource as GroupTimeline;
			if (prevGroupSource.children !== timeline.children) {
				// 関係が変わってる場合はがさっと変えた方が手っ取り早い
				updateRelations();
			}
			*/
			// おう、何も考えず変えとけ変えとけ
			updateRelations();
			return;
		}

		if (Settings.maybeTaskTimeline(timeline)) {
			const src = prevSource as TaskTimeline;

			// 先祖グループに対してふわーっと処理
			const groups = Timelines.getParentGroups(timeline, props.editData.setting.rootTimeline);
			if (groups.length) {
				const reversedGroups = groups.reverse();
				// 工数
				if (timeline.workload !== src.workload) {
					// 何も考えず全更新(工数が変わってる場合、差分検出するより全更新したほうが手っ取り早い→速度は知らん)
					updateRelations();
					return;
				}
				// 進捗
				if (timeline.progress !== src.progress) {
					for (const group of reversedGroups) {
						timelineItems.push({
							timeline: group
						});
					}
				}
			}
		}

		const changedItems = new Map<TimelineId, TimelineItem>(
			timelineItems.map(a => [a.timeline.id, a])
		);

		const store = createTimelineStore(timelineMap, changedItems);
		setTimelineStore(store);
	}

	function handleMoveTimeline(moveUp: boolean, timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroups(timeline, props.editData.setting.rootTimeline);

		if (groups.length === 1) {
			const newRootChildren = [...rootChildren];
			Timelines.moveTimelineOrder(newRootChildren, moveUp, timeline);
			setRootChildren(props.editData.setting.rootTimeline.children = newRootChildren);
		} else {
			const group = Arrays.last(groups);
			const newRootChildren = [...group.children];
			Timelines.moveTimelineOrder(newRootChildren, moveUp, timeline);
			//group.children = newChildren;
			timelineStore.updateTimeline({
				...group,
				children: newRootChildren,
			});
		}
	}

	function handleRemoveTimeline(timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroups(timeline, props.editData.setting.rootTimeline);

		// 前工程を破棄
		const timelineMap = Timelines.getTimelinesMap(props.editData.setting.rootTimeline);

		for (const [_, value] of timelineMap) {
			if (Settings.maybeTaskTimeline(value)) {
				if (value.previous.includes(timeline.id)) {
					value.previous = value.previous.filter(a => a !== timeline.id);
				}
			}
		}

		// データから破棄
		if (1 < groups.length) {
			const group = Arrays.last(groups);
			const newChildren = group.children.filter(a => a.id !== timeline.id);
			group.children = newChildren;
			// 直接置き換えた値はちまちま反映するのではなくリセット
			updateRelations();
		} else {
			const newRootChildren = rootChildren.filter(a => a.id !== timeline.id);
			setRootChildren(props.editData.setting.rootTimeline.children = newRootChildren);
		}
	}

	function handleStartSelectBeginDate(timeline: TaskTimeline): void {
		console.debug(timeline);
		setSelectingBeginDate({
			timeline: timeline,
			beginDate: timeline.static ? DateTime.parse(timeline.static, calendarInfo.timeZone) : null,
			previous: new Set(timeline.previous),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		});
	}

	function handleClearSelectBeginDate(timeline: TaskTimeline, clearDate: boolean, clearPrevious: boolean): void {
		setSelectingBeginDate(c => ({
			timeline: timeline,
			beginDate: clearDate ? null : c?.beginDate ?? null,
			previous: clearPrevious ? new Set() : c?.previous ?? new Set(),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		}));
	}

	function handleSetSelectBeginDate(timeline: TaskTimeline, set: ReadonlySet<TimelineId>): void {
		setSelectingBeginDate(c => ({
			timeline: timeline,
			beginDate: c?.beginDate ?? null,
			previous: new Set(set),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		}));
	}

	function canSelectCore(targetTimeline: AnyTimeline, currentTimeline: AnyTimeline): boolean {
		const groups = Timelines.getParentGroups(currentTimeline, props.editData.setting.rootTimeline);
		if (groups.length) {
			return !groups.some(a => a.id === targetTimeline.id);
		}

		return true;
	}

	function handleSubmitSelectBeginDate(timeline: TaskTimeline): void {
		setSelectingBeginDate(null);
		updateRelations();
	}

	function handleCancelSelectBeginDate(): void {
		setSelectingBeginDate(null);
	}


	const beginDateCallbacks: BeginDateCallbacks = {
		startSelectBeginDate: handleStartSelectBeginDate,
		clearSelectBeginDate: handleClearSelectBeginDate,
		setSelectBeginDate: handleSetSelectBeginDate,
		submitSelectBeginDate: handleSubmitSelectBeginDate,
		cancelSelectBeginDate: handleCancelSelectBeginDate,
	};

	return (
		<div id='timeline'>
			{renderDynamicStyle(props.configuration.design, props.editData.setting.theme)}

			<CrossHeader
				configuration={props.configuration}
				editData={props.editData}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
			<DaysHeader
				configuration={props.configuration}
				editData={props.editData}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
			<TimelineItems
				configuration={props.configuration}
				editData={props.editData}
				draggingTimeline={draggingTimeline}
				dropTimeline={dropTimeline}
				selectingBeginDate={selectingBeginDate}
				beginDateCallbacks={beginDateCallbacks}
				updateRelations={updateRelations}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
			<TimelineViewer
				configuration={props.configuration}
				editData={props.editData}
				updateRelations={updateRelations}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
			{/* <DrawArea
				configuration={props.configuration}
				editData={props.editData}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/> */}
		</div>
	);
};

export default Component;

function renderDynamicStyle(design: Design, theme: Theme): ReactNode {

	// 動的なCSSクラス名をここでがっつり作るのです
	const styleObject = {
		design: design.honest,

		programmable: {
			cell: {
				height: {
					height: design.honest.cell.height,
					maxHeight: design.honest.cell.height,
				},
				width: {
					width: design.honest.cell.width,
					maxWidth: design.honest.cell.width,
				}
			},

			groups: {
				...Array.from(Array(design.programmable.group.maximum), (_, index) => index + 1)
					.map(a => {
						const backgroundColor = (a - 1) in theme.groups ? theme.groups[a - 1] : theme.timeline.group;
						const foregroundColor = Colors.getAutoColor(backgroundColor);

						return {
							[`level-${a}`]: {
								color: foregroundColor.toHexString(),
								background: backgroundColor,
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
			},

			indexNumber: {
				...Array.from(Array(design.programmable.indexNumber.maximum), (_, index) => index + 1)
					.map(a => {
						return {
							[`level-${a}`]: {
								display: "inline-block",
								paddingLeft: (a * design.programmable.indexNumber.paddingLeft.value) + design.programmable.indexNumber.paddingLeft.unit,
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
			},
		},

		theme: {
			holiday: {
				regulars: Settings.getWeekDays()
					.filter(a => a in theme.holiday.regulars)
					.map(a => {
						const backgroundColor = new TinyColor(theme.holiday.regulars[a]);
						return {
							[a]: {
								color: Colors.getAutoColor(backgroundColor).toHexString(),
								background: backgroundColor.toHexString(),
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
				events: Object.entries(theme.holiday.events)
					.map(([k, v]) => {
						const backgroundColor = new TinyColor(v);
						return {
							[k]: {
								color: Colors.getAutoColor(backgroundColor).toHexString(),
								background: `${backgroundColor.toHexString()} !important`
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
			}
		},
	};

	const styleClasses = Designs.convertStyleClasses(styleObject, ["_dynamic"]);
	const style = Designs.convertStylesheet(styleClasses);

	return (
		<style>
			{style}
		</style>
	);
}

function createEmptyTimeline(timelineKind: TimelineKind): AnyTimeline {
	switch (timelineKind) {
		case "group":
			return Timelines.createNewGroup();

		case "task":
			return Timelines.createNewTask();

		default:
			throw new Error();
	}
}

