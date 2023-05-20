import { FC, useEffect, useLayoutEffect, useMemo } from "react";
import { ReactNode, useState } from "react";

import CrossHeader from "@/components/elements/pages/editor/timeline/CrossHeader";
import DaysHeader from "@/components/elements/pages/editor/timeline/DaysHeader";
import HighlightArea from "@/components/elements/pages/editor/timeline/HighlightArea";
import TimelineDetailEditDialog from "@/components/elements/pages/editor/timeline/TimelineDetailEditDialog";
import TimelineItems from "@/components/elements/pages/editor/timeline/TimelineItems";
import TimelineViewer from "@/components/elements/pages/editor/timeline/TimelineViewer";
import { useLocale } from "@/locales/locale";
import { Arrays } from "@/models/Arrays";
import { Color } from "@/models/Color";
import { useDetailEditTimelineAtomReader, useDetailEditTimelineAtomWriter, useDraggingTimelineAtomWriter, useDragSourceTimelineAtomReader, useDragSourceTimelineAtomWriter } from "@/models/data/atom/editor/DragAndDropAtoms";
import { useActiveTimelineIdAtomWriter, useDragOverTimelineIdAtomWriter, useDragSourceTimelineIdAtomWriter, useHighlightDaysAtomWriter, useHighlightTimelineIdsAtomWriter, useHoverTimelineIdAtomWriter } from "@/models/data/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useSequenceTimelinesAtomReader, useSequenceTimelinesWriterAtomWriter, useSettingAtomWriter } from "@/models/data/atom/editor/TimelineAtoms";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { Design } from "@/models/data/Design";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { EditorData } from "@/models/data/EditorData";
import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { ReadableTimelineId } from "@/models/data/ReadableTimelineId";
import { AnyTimeline, GroupTimeline, TaskTimeline, Theme, TimelineId, TimelineKind } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Designs } from "@/models/Designs";
import { Editors } from "@/models/Editors";
import { Settings } from "@/models/Settings";
import { MoveDirection, TimelineStore } from "@/models/store/TimelineStore";
import { Strings } from "@/models/Strings";
import { Timelines } from "@/models/Timelines";

/*
心臓部

この子から色んなバグが生まれる。
*/

interface Props extends ConfigurationProps {
	editorData: EditorData;
}

const TimelineEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const activeTimelineIdAtomWriter = useActiveTimelineIdAtomWriter();
	const highlightTimelineIdsAtomWriter = useHighlightTimelineIdsAtomWriter();
	const highlightDaysAtomWriter = useHighlightDaysAtomWriter();
	const detailEditTimelineAtomReader = useDetailEditTimelineAtomReader();
	const detailEditTimelineAtomWriter = useDetailEditTimelineAtomWriter();
	const dragSourceTimelineAtomReader = useDragSourceTimelineAtomReader();
	const dragSourceTimelineAtomWriter = useDragSourceTimelineAtomWriter();
	const draggingTimelineAtomReader = useDraggingTimelineAtomWriter();
	const dragSourceTimelineIdAtomWriter = useDragSourceTimelineIdAtomWriter();
	const dragOverTimelineIdAtomWriter = useDragOverTimelineIdAtomWriter();
	const sequenceTimelinesWriterAtomWriter = useSequenceTimelinesWriterAtomWriter();
	const sequenceTimelinesAtomReader = useSequenceTimelinesAtomReader();
	//const [/*totalTimelineMap*/, setTotalTimelineMap] = useAtom(TotalTimelineMapAtom);
	const settingAtomWriter = useSettingAtomWriter();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const [timelineStore, setTimelineStore] = useState<TimelineStore>(createTimelineStore());
	const [selectingBeginDate, setSelectingBeginDate] = useState<SelectingBeginDate | null>(null);

	const dynamicStyleNodes = useMemo(() => {
		return renderDynamicStyle(props.configuration.design, props.editorData.setting.theme);
	}, [props.configuration.design, props.editorData.setting.theme]);

	//TODO: クソ重いっぽいんやけどどう依存解決してメモ化するのか分からんので枝葉から対応するのです

	// // 初回のみ
	// useEffect(() => {
	// 	updateRelations();
	// }, []); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect(() => {
		settingAtomWriter.write(props.editorData.setting);
		sequenceTimelinesWriterAtomWriter.write(...Timelines.flat(props.editorData.setting.rootTimeline.children));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		updateRelations();
	}, [sequenceTimelinesAtomReader.data]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		function fireDropTimeline(dropTimeline: DropTimeline) {
			console.debug("FIRE");

			const sameGroup = dropTimeline.sourceGroupTimeline.id === dropTimeline.destinationGroupTimeline.id;

			if (sameGroup) {
				// 同一グループ内移動
				Arrays.moveIndexInPlace(dropTimeline.sourceGroupTimeline.children, dropTimeline.sourceIndex, dropTimeline.destinationIndex);
			} else {
				// グループから破棄
				const newSourceChildren = dropTimeline.sourceGroupTimeline.children.filter(a => a.id !== dropTimeline.timeline.id);
				dropTimeline.sourceGroupTimeline.children = newSourceChildren;

				// 別グループに追加
				if (dropTimeline.destinationIndex === -1) {
					dropTimeline.destinationGroupTimeline.children.push(dropTimeline.timeline);
				} else {
					dropTimeline.destinationGroupTimeline.children.splice(dropTimeline.destinationIndex, 0, dropTimeline.timeline);
				}
			}

			sequenceTimelinesWriterAtomWriter.write(...Timelines.flat(props.editorData.setting.rootTimeline.children));

			activeTimelineIdAtomWriter.write(undefined);
			hoverTimelineIdAtomWriter.write(dropTimeline.timeline.id);
			highlightTimelineIdsAtomWriter.write([dropTimeline.timeline.id]);
		}

		if (dragSourceTimelineAtomReader.data) {
			const dragSourceTimeline = dragSourceTimelineAtomReader.data;
			const dragging: DraggingTimeline = {
				sourceTimeline: dragSourceTimelineAtomReader.data,
				onDragEnd: (ev) => {
					console.debug("END", ev, dragSourceTimeline);
					draggingTimelineAtomReader.write(undefined);
					dragSourceTimelineAtomWriter.write(undefined);
					dragSourceTimelineIdAtomWriter.write(undefined);
					dragOverTimelineIdAtomWriter.write(undefined);
				},
				onDragEnter: (ev, targetTimeline) => {
					console.debug("ENTER", ev, targetTimeline);
					if (targetTimeline.id === dragSourceTimeline.id) {
						dragOverTimelineIdAtomWriter.write(undefined);
					} else {
						dragOverTimelineIdAtomWriter.write(targetTimeline.id);
					}
				},
				onDragOver: (ev, targetTimeline) => {
					console.debug("OVER", ev, targetTimeline);
					// 自分自身への移動は抑制
					if (targetTimeline.id === dragSourceTimeline.id) {
						return;
					}

					if (Settings.maybeGroupTimeline(dragSourceTimeline)) {
						// 自分がグループの場合、自分より下への移動は抑制
						const map = Timelines.getTimelinesMap(dragSourceTimeline);
						if (map.has(targetTimeline.id)) {
							return;
						}
					}

					// 自身のグループへの移動は抑制(どうすりゃいいのか正解が分からん)
					if (Settings.maybeGroupTimeline(targetTimeline)) {
						if (targetTimeline.children.find(a => a.id === dragSourceTimeline.id)) {
							return;
						}
					}

					ev.preventDefault();
				},
				onDragLeave: (ev, targetTimeline) => {
					console.debug("LEAVE", ev, targetTimeline);
				},
				onDrop: (ev, targetTimeline) => {
					console.debug("DROP", ev, targetTimeline);

					const sourceGroupTimelines = Timelines.getParentGroups(dragSourceTimeline, props.editorData.setting.rootTimeline);
					const targetGroupTimelines = Timelines.getParentGroups(targetTimeline, props.editorData.setting.rootTimeline);

					if (!sourceGroupTimelines.length || !targetGroupTimelines.length) {
						// ツリーにいない場合はどうにもならん
						throw new Error(JSON.stringify({
							sourceGroupTimelines,
							targetGroupTimelines,
						}));
					}

					// 対象がグループの場合、そのグループへ移動
					if (Settings.maybeGroupTimeline(targetTimeline)) {
						const sourceGroupTimeline = sourceGroupTimelines[sourceGroupTimelines.length - 1];
						const sourceIndex = sourceGroupTimeline.children.findIndex(a => a.id === dragSourceTimeline.id);

						fireDropTimeline({
							timeline: dragSourceTimeline,
							sourceGroupTimeline: sourceGroupTimeline,
							sourceIndex: sourceIndex,
							destinationGroupTimeline: targetTimeline,
							destinationIndex: -1,
						});
						return;
					}

					// 単純移動
					const sourceNodes = sourceGroupTimelines[sourceGroupTimelines.length - 1].children;
					const sourceIndex = sourceNodes.findIndex(a => a.id === dragSourceTimeline.id);
					const destinationNodes = targetGroupTimelines[targetGroupTimelines.length - 1].children;
					const destinationIndex = destinationNodes.findIndex(a => a.id === targetTimeline.id);
					fireDropTimeline({
						timeline: dragSourceTimeline,
						sourceGroupTimeline: sourceGroupTimelines[sourceGroupTimelines.length - 1],
						sourceIndex: sourceIndex,
						destinationGroupTimeline: targetGroupTimelines[targetGroupTimelines.length - 1],
						destinationIndex: destinationIndex,
					});
				}
			};

			activeTimelineIdAtomWriter.write(undefined);
			hoverTimelineIdAtomWriter.write(dragSourceTimeline.id);
			highlightTimelineIdsAtomWriter.write([]);
			dragSourceTimelineIdAtomWriter.write(dragging.sourceTimeline.id);
			draggingTimelineAtomReader.write(dragging);
		}
	}, [props.editorData.setting.rootTimeline, sequenceTimelinesWriterAtomWriter, activeTimelineIdAtomWriter, hoverTimelineIdAtomWriter, highlightTimelineIdsAtomWriter, dragSourceTimelineIdAtomWriter, dragOverTimelineIdAtomWriter, dragSourceTimelineAtomReader.data, dragSourceTimelineAtomWriter, draggingTimelineAtomReader]);

	function createTimelineStore(): TimelineStore {
		const result: TimelineStore = {
			calcReadableTimelineId: handleCalcReadableTimelineId,
			searchBeforeTimeline: handleSearchBeforeTimeline,

			addEmptyTimeline: handleAddEmptyTimeline,
			addNewTimeline: handleAddNewTimeline,
			updateTimeline: handleUpdateTimeline,
			moveTimeline: handleMoveTimeline,
			removeTimeline: handleRemoveTimeline,
		};

		return result;
	}

	// TODO: atom を連鎖的に更新すればこいつはもういらないはず
	function updateRelations() {
		console.debug("全体へ通知");

		// const timelineMap = Timelines.getTimelinesMap(rootTimeline);
		// setTotalTimelineMap(timelineMap);

		//const timelineMap = Timelines.getTimelinesMap(props.editorData.setting.rootTimeline);
		//const workRanges = Timelines.getWorkRanges([...timelineMap.values()], props.editorData.setting.calendar.holiday, props.editorData.setting.recursive, calendarInfo.timeZone);

		// const changedItems = new Map(
		// 	[...timelineMap.entries()]
		// 		.map(([k, v]) => {
		// 			const item: TimelineItem = {
		// 				timeline: v,
		// 				workRange: Require.get(workRanges, k),
		// 			};

		// 			return [k, item];
		// 		})
		// );
		const store = createTimelineStore();
		setTimelineStore(store);
	}

	function handleEndDetailEdit(changedTimeline: AnyTimeline | null): void {
		console.debug("詳細編集終了", changedTimeline);

		detailEditTimelineAtomWriter.write(undefined);

		if (changedTimeline) {
			handleUpdateTimeline(changedTimeline);
			updateRelations();
		}
	}

	function handleCalcReadableTimelineId(timeline: Readonly<AnyTimeline>): ReadableTimelineId {
		return Timelines.calcReadableTimelineId(timeline, props.editorData.setting.rootTimeline);
	}

	function handleSearchBeforeTimeline(timeline: AnyTimeline): AnyTimeline | undefined {
		return Timelines.searchBeforeTimeline(timeline, props.editorData.setting.rootTimeline);
	}

	function handleAddEmptyTimeline(baseTimeline: AnyTimeline, options: NewTimelineOptions): void {
		const newTimeline = createEmptyTimeline(options.timelineKind);

		handleAddNewTimeline(baseTimeline, newTimeline, options.position);
	}

	function handleAddNewTimeline(baseTimeline: AnyTimeline, newTimeline: AnyTimeline, position: NewTimelinePosition): void {
		console.trace("ADD", newTimeline);

		// 将来追加した場合の安全弁
		if (position !== NewTimelinePosition.Next) {
			throw new Error(position);
		}

		if (!newTimeline.subject) {
			const timelineSubjects = new Set(
				sequenceTimelinesAtomReader.data.filter(a => a.kind === newTimeline.kind)
					.map(a => a.subject)
			);
			const defaultSubject = newTimeline.kind === "group"
				? locale.common.timeline.newGroupTimeline
				: locale.common.timeline.newTaskTimeline
				;
			newTimeline.subject = Strings.toUniqueDefault(defaultSubject, timelineSubjects);
		}

		let parent: GroupTimeline;
		if (Settings.maybeGroupTimeline(baseTimeline)) {
			parent = baseTimeline;
		} else {
			const groups = Timelines.getParentGroups(baseTimeline, props.editorData.setting.rootTimeline);
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

		// 前工程の設定されていないタスクに対して可能であれば直近項目を前項目として設定
		const newTaskTimeline = Timelines.getFirstTaskTimeline(newTimeline);
		if (newTaskTimeline) {
			const beforeTimeline = Timelines.searchBeforeTimeline(newTaskTimeline, props.editorData.setting.rootTimeline);
			if (beforeTimeline) {
				newTaskTimeline.previous = [beforeTimeline.id];
			}
		}

		sequenceTimelinesWriterAtomWriter.write(...Timelines.flat(props.editorData.setting.rootTimeline.children));
		setTimeout(() => {
			highlightTimelineIdsAtomWriter.write([newTimeline.id]);
			highlightDaysAtomWriter.write([]);
			Editors.scrollView(newTimeline, undefined);
		}, 0);
	}

	function handleUpdateTimeline(timeline: AnyTimeline): void {
		//
		const source = Timelines.findTimeline(timeline.id, props.editorData.setting.rootTimeline);
		if (!source) {
			return;
		}
		if (source.kind !== timeline.kind) {
			throw new Error();
		}

		//const prevSource = { ...source };
		Object.assign(source, timeline);
		// const timelineItems = new Array<TimelineItem>();
		// timelineItems.push({
		// 	timeline: source
		// });

		// if (Settings.maybeGroupTimeline(timeline)) {
		// 	/*
		// 	const prevGroupSource = prevSource as GroupTimeline;
		// 	if (prevGroupSource.children !== timeline.children) {
		// 		// 関係が変わってる場合はがさっと変えた方が手っ取り早い
		// 		updateRelations();
		// 	}
		// 	*/
		// 	// おう、何も考えず変えとけ変えとけ
		// 	updateRelations();
		// 	return;
		// }

		// if (Settings.maybeTaskTimeline(timeline)) {
		// 	const src = prevSource as TaskTimeline;

		// 	// 先祖グループに対してふわーっと処理
		// 	const groups = Timelines.getParentGroups(timeline, props.editorData.setting.rootTimeline);
		// 	if (groups.length) {
		// 		const reversedGroups = groups.reverse();
		// 		// 工数
		// 		if (timeline.workload !== src.workload) {
		// 			// 何も考えず全更新(工数が変わってる場合、差分検出するより全更新したほうが手っ取り早い→速度は知らん)
		// 			updateRelations();
		// 			return;
		// 		}
		// 		// 進捗
		// 		if (timeline.progress !== src.progress) {
		// 			for (const group of reversedGroups) {
		// 				timelineItems.push({
		// 					timeline: group
		// 				});
		// 			}
		// 		}
		// 	}
		// }

		// const changedItems = new Map<TimelineId, TimelineItem>(
		// 	timelineItems.map(a => [a.timeline.id, a])
		// );

		const store = createTimelineStore();
		setTimelineStore(store);
		sequenceTimelinesWriterAtomWriter.write(...Timelines.flat(props.editorData.setting.rootTimeline.children));
	}

	function handleMoveTimeline(direction: MoveDirection, timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroups(timeline, props.editorData.setting.rootTimeline);

		if (direction === "parent") {
			if (1 < groups.length) {
				//TODO: 正直どこに配置すればいいのか分からん
				const srcGroup = groups[groups.length - 1];
				const destGroup = groups[groups.length - 2];
				srcGroup.children = srcGroup.children.filter(a => a.id !== timeline.id);
				destGroup.children.push(timeline);
			} else {
				console.debug("最上位項目は何もしない");
				return;
			}
		} else {
			const group = Arrays.last(groups);
			Arrays.replaceOrderInPlace(group.children, direction === "down", timeline);
		}

		sequenceTimelinesWriterAtomWriter.write(...Timelines.flat(props.editorData.setting.rootTimeline.children));	}

	function handleRemoveTimeline(timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroups(timeline, props.editorData.setting.rootTimeline);

		// 前工程を破棄
		const timelineMap = Timelines.getTimelinesMap(props.editorData.setting.rootTimeline);

		for (const [_, value] of timelineMap) {
			if (Settings.maybeTaskTimeline(value)) {
				if (value.previous.includes(timeline.id)) {
					value.previous = value.previous.filter(a => a !== timeline.id);
				}
			}
		}

		// データから破棄
		const group = Arrays.last(groups);
		const newChildren = group.children.filter(a => a.id !== timeline.id);
		group.children = newChildren;
		sequenceTimelinesWriterAtomWriter.write(...Timelines.flat(props.editorData.setting.rootTimeline.children));	}

	function handleStartSelectBeginDate(timeline: TaskTimeline): void {
		console.debug(timeline);
		setSelectingBeginDate({
			timeline: timeline,
			beginDate: timeline.static ? DateTime.parse(timeline.static, calendarInfoAtomReader.data.timeZone) : null,
			previous: new Set(timeline.previous),
			canSelect: (targetTimeline) => Timelines.canSelect(targetTimeline, timeline, props.editorData.setting.rootTimeline),
		});
	}

	function handleClearSelectBeginDate(timeline: TaskTimeline, clearDate: boolean, clearPrevious: boolean): void {
		setSelectingBeginDate(c => ({
			timeline: timeline,
			beginDate: clearDate ? null : c?.beginDate ?? null,
			previous: clearPrevious ? new Set() : c?.previous ?? new Set(),
			canSelect: (targetTimeline) => Timelines.canSelect(targetTimeline, timeline, props.editorData.setting.rootTimeline),
		}));
	}

	function handleSetSelectBeginDate(timeline: TaskTimeline, set: ReadonlySet<TimelineId>): void {
		setSelectingBeginDate(c => ({
			timeline: timeline,
			beginDate: c?.beginDate ?? null,
			previous: new Set(set),
			canSelect: (targetTimeline) => Timelines.canSelect(targetTimeline, timeline, props.editorData.setting.rootTimeline)
		}));
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
		<div id="timeline">
			{dynamicStyleNodes}

			<CrossHeader
				configuration={props.configuration}
				timelineStore={timelineStore}
			/>
			<DaysHeader
				configuration={props.configuration}
				timelineStore={timelineStore}
			/>
			<TimelineItems
				configuration={props.configuration}
				selectingBeginDate={selectingBeginDate}
				beginDateCallbacks={beginDateCallbacks}
				timelineStore={timelineStore}
			/>
			<TimelineViewer
				configuration={props.configuration}
				timelineStore={timelineStore}
			/>
			<HighlightArea
				configuration={props.configuration}
				timelineStore={timelineStore}
			/>
			{detailEditTimelineAtomReader.data && <TimelineDetailEditDialog
				configuration={props.configuration}
				timeline={detailEditTimelineAtomReader.data}
				callbackSubmit={(timeline) => handleEndDetailEdit(timeline)}
			/>}
		</div>
	);
};

export default TimelineEditor;

function renderDynamicStyle(design: Design, theme: Theme): ReactNode {
	console.time("CSS");

	// 動的なCSSクラス名をここでがっつり作るのです
	const styleObject = {
		design: {
			cell: {
				// なんかね、height,max-height 指定だけだと firefox は大丈夫だけど chromium が1px ずれたのよ。難しい話は知らん
				minHeight: design.seed.cell.height,
				maxHeight: design.seed.cell.height,
				minWidth: design.seed.cell.width,
				maxWidth: design.seed.cell.width,
			}
		},

		programmable: {
			cell: {
				height: {
					minHeight: design.seed.cell.height,
					maxHeight: design.seed.cell.height,
				},
				width: {
					minWidth: design.seed.cell.width,
					maxWidth: design.seed.cell.width,
				}
			},

			groups: {
				...Arrays.range(1, design.programmable.group.maximum)
					.map(level => {
						const index = level - 1;
						const backgroundColor = index in theme.groups ? theme.groups[index] : theme.timeline.defaultGroup;
						const foregroundColor = Color.parse(backgroundColor).getAutoColor();

						return {
							[`level-${level}`]: {
								color: foregroundColor.toHtml(),
								background: backgroundColor,
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
			},

			readableTimelineId: {
				...Arrays.range(1, design.programmable.group.maximum)
					.map(level => {
						const paddingWidth = `${((level - 1) * design.programmable.readableTimelineId.paddingLeft.value) + design.programmable.readableTimelineId.paddingLeft.unit}`;

						const index = level - 2;
						//let paddingColor = "transparent";
						let gradient: string | undefined;
						if (0 <= index) {
							//paddingColor = index in theme.groups ? theme.groups[index] : theme.timeline.group;

							// グラデーションの生成
							const colors = new Array<string>();
							for (let i = 0; i <= index; i++) {
								const color = i in theme.groups ? theme.groups[i] : theme.timeline.defaultGroup;
								colors.push(color);
							}
							const gradients = colors
								.map((a, i) => {
									const from = (i / colors.length);
									const to = from + (1 / colors.length);
									return `${a} ${from * 100}% ${to * 100}%`;
								})
								;
							gradient = `linear-gradient(to right, ${gradients.join(",")})`;
						}


						return {
							[`level-${level}`]: {
								display: "inline-block",
								position: "relative",
								paddingLeft: paddingWidth,
							},
							[`level-${level}::before`]: {
								content: "''",
								position: "absolute",
								display: "block",
								background: gradient,
								top: 0,
								left: 0,
								maxWidth: paddingWidth,
								minWidth: paddingWidth,
								height: "100%",
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
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						const backgroundColor = Color.parse(theme.holiday.regulars[a]!);
						return {
							[a]: {
								color: backgroundColor.getAutoColor().toHtml(),
								background: backgroundColor.toHtml(),
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
				events: Object.entries(theme.holiday.events)
					.map(([k, v]) => {
						const backgroundColor = Color.parse(v);
						return {
							[k]: {
								color: backgroundColor.getAutoColor().toHtml(),
								background: `${backgroundColor.toHtml()} !important`
							}
						};
					})
					.reduce((r, a) => ({ ...r, ...a })),
			}
		},
	};

	const styleClasses = Designs.convertStyleClasses(styleObject, ["_dynamic"]);
	const style = Designs.convertStylesheet(styleClasses);

	console.timeLog("CSS", "作成");

	try {
		return (
			<style>
				{style}
			</style>
		);
	} finally {
		console.timeEnd("CSS");
	}
}

function createEmptyTimeline(timelineKind: TimelineKind): AnyTimeline {
	switch (timelineKind) {
		case "group":
			return Timelines.createGroupTimeline();

		case "task":
			return Timelines.createTaskTimeline();

		default:
			throw new Error();
	}
}

