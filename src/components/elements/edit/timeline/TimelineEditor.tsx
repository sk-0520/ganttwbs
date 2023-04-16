import { NextPage } from "next";
import { DragEvent } from "react";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";
import { ReactNode, useEffect, useState } from "react";
import { AnyTimeline, Calendar, GroupTimeline, TaskTimeline, Theme, Timeline, TimelineId } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";
import { EditProps } from "@/models/data/props/EditProps";
import { Design } from "@/models/data/Design";
import { Designs } from "@/models/Designs";
import { Settings } from "@/models/Settings";
import { TinyColor } from "@ctrl/tinycolor";
import { TimelineStore } from "@/models/store/TimelineStore";
import { TimelineItem } from "@/models/data/TimelineItem";
import Colors from "@/models/Colors";
import { TimeZone } from "@/models/TimeZone";
import { CalendarRange } from "@/models/data/CalendarRange";
import { DateTime } from "@/models/DateTime";
import { WorkRange } from "@/models/data/WorkRange";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { Calendars } from "@/models/Calendars";
import { Arrays } from "@/models/Arrays";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {

	const workRangesCache = new Map<TimelineId, WorkRange>();
	const [timelineNodes, setTimelineNodes] = useState(props.editData.setting.timelineNodes);
	const [timelineStore, setTimelineStore] = useState<TimelineStore>(createTimelineStore(new Map(), new Map()));
	const [draggingTimeline, setDraggingTimeline] = useState<DraggingTimeline | null>(null);
	const [dropTimeline, setDropTimeline] = useState<DropTimeline | null>(null);
	const [selectingBeginDate, setSelectingBeginDate] = useState<SelectingBeginDate | null>(null);

	const calendarInfo = Calendars.createCalendarInfo(props.editData.setting.timeZone, props.editData.setting.calendar);

	function updateRelations() {
		console.debug("全体へ通知");

		const timelineMap = Timelines.getTimelinesMap(timelineNodes);
		const dateTimeRanges = Timelines.getDateTimeRanges([...timelineMap.values()], props.editData.setting.calendar.holiday, props.editData.setting.recursive, calendarInfo.timeZone);

		const changedItems = new Map(
			[...timelineMap.entries()]
				.filter(([k, _]) => timelineMap.has(k))
				.map(([k, v]) => {
					const item: TimelineItem = {
						timeline: v,
						range: dateTimeRanges.get(k),
					}

					return [k, item];
				})
		);
		const store = createTimelineStore(timelineMap, changedItems);
		setTimelineStore(store);
	}

	function createTimelineStore(totalItems: Map<TimelineId, AnyTimeline>, changedItems: Map<TimelineId, TimelineItem>): TimelineStore {

		for (const [k, v] of changedItems) {
			if (v.range) {
				workRangesCache.set(k, v.range);
			}
		}

		const result: TimelineStore = {
			nodeItems: timelineNodes,
			totalItems: totalItems,
			changedItems: changedItems,
			workRanges: workRangesCache,
			updateTimeline: handleUpdateTimeline,
			moveTimeline: handleMoveTimeline,
			removeTimeline: handleRemoveTimeline,
			startDragTimeline: handleStartDragTimeline,
		};

		return result;
	}

	function fireDropTimeline(dropTimeline: DropTimeline) {
		console.debug("FIRE");

		if (!dropTimeline.sourceGroupTimeline && !dropTimeline.destinationGroupTimeline) {
			// 最上位完結
			Timelines.moveTimelineIndex(timelineNodes, dropTimeline.sourceIndex, dropTimeline.destinationIndex);
			setTimelineNodes(timelineNodes);
		} else {
			// 最上位に対してあれこれ
			if (!dropTimeline.sourceGroupTimeline) {
				// 移動元が親なので破棄
				const nextTimelines = timelineNodes.filter(a => a.id !== dropTimeline.timeline.id);
				setTimelineNodes(nextTimelines);
			}
			if (!dropTimeline.destinationGroupTimeline) {
				// 移動先が親なので追加
				timelineNodes.splice(dropTimeline.destinationIndex, 0, dropTimeline.timeline);
				setTimelineNodes(timelineNodes);
			}
			// 子に通知
			setDropTimeline(dropTimeline);
		}

		setDraggingTimeline(null);

		// 多分再計算が必要
		updateRelations();
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
					const map = Timelines.getTimelinesMap(sourceTimeline.children);
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

				const rootNodes = timelineNodes;
				const sourceGroupTimelines = Timelines.getParentGroup(sourceTimeline, rootNodes);
				const targetGroupTimelines = Timelines.getParentGroup(targetTimeline, rootNodes);

				if (!sourceGroupTimelines || !targetGroupTimelines) {
					// ツリーにいない場合はどうにもならん
					throw new Error(JSON.stringify({
						sourceGroupTimelines,
						targetGroupTimelines,
					}));
				}

				// 最上位から最上位
				if (!sourceGroupTimelines.length && !targetGroupTimelines.length) {
					const sourceIndex = rootNodes.findIndex(a => a.id === sourceTimeline.id);
					const destinationIndex = rootNodes.findIndex(a => a.id === targetTimeline.id);
					if (sourceIndex === -1 || destinationIndex === -1) {
						throw new Error(JSON.stringify({
							sourceIndex,
							destinationIndex,
						}));
					}

					fireDropTimeline({
						timeline: sourceTimeline,
						sourceGroupTimeline: null,
						destinationGroupTimeline: null,
						sourceIndex: sourceIndex,
						destinationIndex: destinationIndex,
					});
					return;
				}

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
				const sourceNodes = sourceGroupTimelines.length ? sourceGroupTimelines[sourceGroupTimelines.length - 1].children : rootNodes;
				const sourceIndex = sourceNodes.findIndex(a => a.id === sourceTimeline.id);
				const destinationNodes = targetGroupTimelines.length ? targetGroupTimelines[targetGroupTimelines.length - 1].children : rootNodes;
				const destinationIndex = destinationNodes.findIndex(a => a.id === targetTimeline.id);
				fireDropTimeline({
					timeline: sourceTimeline,
					sourceGroupTimeline: sourceGroupTimelines.length ? sourceGroupTimelines[sourceGroupTimelines.length - 1] : null,
					sourceIndex: sourceIndex,
					destinationGroupTimeline: targetGroupTimelines.length ? targetGroupTimelines[targetGroupTimelines.length - 1] : null,
					destinationIndex: destinationIndex,
				});
			}
		};

		setDraggingTimeline(dragging);
	}

	function handleUpdateTimeline(timeline: AnyTimeline): void {
		//
		const source = Timelines.findTimeline(timeline.id, timelineNodes);
		if (!source) {
			return;
		}
		if (source.kind !== timeline.kind) {
			throw new Error();
		}

		const timelineMap = Timelines.getTimelinesMap(timelineNodes);

		const prevSource = { ...source };
		Object.assign(source, timeline);
		const timelineItems = new Array<TimelineItem>();
		timelineItems.push({
			timeline: source
		});

		if (Settings.maybeGroupTimeline(timeline)) {
			const prevGroupSource = prevSource as GroupTimeline;
			if (prevGroupSource.children !== timeline.children) {
				// 関係が変わってる場合はがさっと変えた方が手っ取り早い
				updateRelations();
			}
		}

		if (Settings.maybeTaskTimeline(timeline)) {
			const src = prevSource as TaskTimeline;

			// 先祖グループに対してふわーっと処理
			const groups = Timelines.getParentGroup(timeline, timelineNodes);
			if (groups) {
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
		const groups = Timelines.getParentGroup(timeline, timelineNodes)
		if (!groups) {
			return;
		}

		if (groups.length) {
			const group = Arrays.last(groups);
			const newChildren = [...group.children];
			Timelines.moveTimelineOrder(newChildren, moveUp, timeline);
			group.children = newChildren;
		} else {
			const newChildren = [...timelineNodes];
			Timelines.moveTimelineOrder(newChildren, moveUp, timeline);
			setTimelineNodes(newChildren);
		}

		// 直接置き換えた値はちまちま反映するのではなくリセット
		updateRelations();
	}

	function handleRemoveTimeline(timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroup(timeline, timelineNodes)
		if (!groups) {
			return;
		}

		// データから破棄
		if (groups.length) {
			const group = Arrays.last(groups);
			const newChildren = group.children.filter(a => a.id !== timeline.id);
			group.children = newChildren;
		} else {
			const newTimelineNodes = timelineNodes.filter(a => a.id !== timeline.id);
			props.editData.setting.timelineNodes = newTimelineNodes;
			setTimelineNodes(props.editData.setting.timelineNodes)
		}

		// 前工程から破棄
		const timelineMap = Timelines.getTimelinesMap(timelineNodes);
		for (const [_, value] of timelineMap) {
			if (Settings.maybeTaskTimeline(value)) {
				if (value.previous.includes(timeline.id)) {
					value.previous = value.previous.filter(a => a !== timeline.id);
				}
			}
		}

		// 直接置き換えた値はちまちま反映するのではなくリセット
		updateRelations();
	}

	function handleStartSelectBeginDate(timeline: TaskTimeline): void {
		console.debug(timeline);
		setSelectingBeginDate({
			timeline: timeline,
			beginDate: timeline.static ? DateTime.parse(timeline.static, calendarInfo.timeZone) : null,
			previous: new Set(timeline.previous),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		})
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

	function canSelectCore(targetTimeline: Timeline, currentTimeline: Timeline): boolean {
		const groups = Timelines.getParentGroup(currentTimeline, timelineNodes);
		if (groups && groups.length) {
			return !groups.some(a => a.id === targetTimeline.id);
		}

		return true;
	}

	function handleSubmitSelectBeginDate(timeline: TaskTimeline): void {
		setSelectingBeginDate(null);
	}

	function handleCancelSelectBeginDate(): void {
		setSelectingBeginDate(null);
	}

	function handleSetTimelineNodes(timelineNodes: Array<GroupTimeline | TaskTimeline>) {
		props.editData.setting.timelineNodes = timelineNodes;
		setTimelineNodes(props.editData.setting.timelineNodes);
	}

	const beginDateCallbacks: BeginDateCallbacks = {
		startSelectBeginDate: handleStartSelectBeginDate,
		clearSelectBeginDate: handleClearSelectBeginDate,
		setSelectBeginDate: handleSetSelectBeginDate,
		submitSelectBeginDate: handleSubmitSelectBeginDate,
		cancelSelectBeginDate: handleCancelSelectBeginDate,
	}

	useEffect(() => {
		updateRelations();
	}, []);


	return (
		<div id='timeline'>
			{renderDynamicStyle(props.configuration.design, props.editData.setting.theme)}

			<CrossHeader
				configuration={props.configuration}
				editData={props.editData}
				timelineRootNodes={timelineNodes}
				setTimelineRootNodes={handleSetTimelineNodes}
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
				timelineRootNodes={timelineNodes}
				draggingTimeline={draggingTimeline}
				dropTimeline={dropTimeline}
				selectingBeginDate={selectingBeginDate}
				beginDateCallbacks={beginDateCallbacks}
				setTimelineRootNodes={handleSetTimelineNodes}
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
						}
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
						}
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
						}
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
						}
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
