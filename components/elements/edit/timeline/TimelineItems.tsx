import { NextPage } from "next";
import { DragEvent, useContext, useEffect, useState } from "react";

import Timelines from "@/models/Timelines";
import { EditContext } from "@/models/data/context/EditContext";
import { useLocale } from "@/models/locales/locale";

import GroupTimelineEditor from "./GroupTimelineEditor";
import TaskTimelineEditor from "./TaskTimelineEditor";
import { MoveItemKind } from "./TimelineControls";
import { GroupTimeline, TaskTimeline, Timeline, TimelineId, TimelineKind } from "@/models/data/Setting";
import { TimeRange } from "@/models/TimeRange";
import SelectingBeginDate from "@/models/data/SelectingBeginDate";
import { Settings } from "@/models/Settings";
import DraggingTimeline from "@/models/data/DraggingTimeline";
import DropTimeline from "@/models/data/DropTimeline";

// interface Props {
// }

//const Component: NextPage<Props> = (props: Props) => {
const Component: NextPage = () => {
	const locale = useLocale();
	const editContext = useContext(EditContext);

	const [timelines, setTimelines] = useState(editContext.data.setting.timelineNodes);
	const [timeRanges, setTimeRanges] = useState<Map<TimelineId, TimeRange>>(new Map());
	const [draggingTimeline, setDraggingTimeline] = useState<DraggingTimeline | null>(null);
	const [dropTimeline, setDropTimeline] = useState<DropTimeline | null>(null);
	const [selectingBeginDate, setSelectingBeginDate] = useState<SelectingBeginDate | null>(null);


	function handleAddNewGroup() {
		const item = Timelines.createNewGroup();

		setTimelines([
			...timelines,
			item,
		]);
		editContext.data.setting.timelineNodes.push(item);
	}

	function handleAddNewTask() {
		const item = Timelines.createNewTask();

		setTimelines([
			...timelines,
			item,
		]);
		editContext.data.setting.timelineNodes.push(item);
	}

	function handleUpdateChildrenOrder(kind: MoveItemKind, currentTimeline: Timeline) {
		if (Timelines.moveTimelineOrder(timelines, kind, currentTimeline)) {
			setTimelines(editContext.data.setting.timelineNodes = [...timelines]);
		}
	}

	function handleAddNextSiblingItem(kind: TimelineKind, currentTimeline: Timeline) {
		const currentIndex = timelines.findIndex(a => a === currentTimeline);

		let item: GroupTimeline | TaskTimeline | null = null;
		switch (kind) {
			case "group":
				item = Timelines.createNewGroup();
				break;

			case "task":
				item = Timelines.createNewTask();
				break;

			default:
				throw new Error();
		}

		editContext.data.setting.timelineNodes.splice(currentIndex + 1, 0, item);
		setTimelines([...editContext.data.setting.timelineNodes]);
	}

	function handleDeleteChildren(currentTimeline: Timeline) {
		const nextTimelines = editContext.data.setting.timelineNodes.filter(a => a !== currentTimeline);

		setTimelines(editContext.data.setting.timelineNodes = nextTimelines);
	}

	function handleUpdateChildrenBeginDate() {
		updateRelations();
	}

	function handleUpdateChildrenWorkload() {
		updateRelations();
	}

	function updateRelations() {
		console.log("全体へ通知");
		const timelineMap = Timelines.getTimelinesMap(editContext.data.setting.timelineNodes);
		const map = Timelines.getTimeRanges([...timelineMap.values()], editContext.data.setting.calendar.holiday, editContext.data.setting.recursive);
		setTimeRanges(map);
	}

	function fireDropTimeline(dropTimeline: DropTimeline) {
		console.debug("FIRE");

		if (!dropTimeline.sourceGroupTimeline && !dropTimeline.destinationGroupTimeline) {
			// 最上位完結
			Timelines.moveTimelineIndex(editContext.data.setting.timelineNodes, dropTimeline.sourceIndex, dropTimeline.destinationIndex);
			setTimelines([...editContext.data.setting.timelineNodes]);
		} else {
			// 最上位に対してあれこれ
			if (!dropTimeline.sourceGroupTimeline) {
				// 移動元が親なので破棄
				const nextTimelines = editContext.data.setting.timelineNodes.filter(a => a.id !== dropTimeline.timeline.id);
				setTimelines(editContext.data.setting.timelineNodes = nextTimelines);
			}
			if (!dropTimeline.destinationGroupTimeline) {
				// 移動先が親なので追加
				editContext.data.setting.timelineNodes.splice(dropTimeline.sourceIndex + 1, 0, dropTimeline.timeline);
				setTimelines([...editContext.data.setting.timelineNodes]);
			}
			// 子に通知
			setDropTimeline(dropTimeline);
		}

		setDraggingTimeline(null);
	}

	function handleStartDragTimeline(event: DragEvent, sourceTimeline: GroupTimeline | TaskTimeline): void {
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

				const rootNodes = editContext.data.setting.timelineNodes;
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

	function handleStartSelectBeginDate(timeline: TaskTimeline): void {
		console.debug(timeline);
		setSelectingBeginDate({
			timeline: timeline,
			beginDate: timeline.static ? new Date(timeline.static) : null,
			previous: new Set(timeline.previous),
		})
	}

	function handleClearSelectBeginDate(timeline: TaskTimeline): void {
		setSelectingBeginDate({
			timeline: timeline,
			beginDate: null,
			previous: new Set(),
		})
	}

	function handleSubmitSelectBeginDate(timeline: TaskTimeline): void {
		setSelectingBeginDate(null);
	}

	function handleCancelSelectBeginDate(): void {
		setSelectingBeginDate(null);
	}

	useEffect(() => {
		updateRelations();
	}, []);

	return (
		<div id='timelines'>
			<>
				<ul>
					{timelines.map((a, i) => {
						return (
							<li key={a.id}>
								{
									Settings.maybeGroupTimeline(a) ? (
										<GroupTimelineEditor
											treeIndexes={[]}
											currentIndex={i}
											parentGroup={null}
											currentTimeline={a}
											timeRanges={timeRanges}
											draggingTimeline={draggingTimeline}
											selectingBeginDate={selectingBeginDate}
											dropTimeline={dropTimeline}
											callbackRefreshChildrenOrder={handleUpdateChildrenOrder}
											callbackRefreshChildrenBeginDate={handleUpdateChildrenBeginDate}
											callbackRefreshChildrenWorkload={handleUpdateChildrenWorkload}
											callbackRefreshChildrenProgress={() => { /*nop*/ }}
											callbackDeleteChildTimeline={handleDeleteChildren}
											callbackDraggingTimeline={handleStartDragTimeline}
											callbackStartSelectBeginDate={handleStartSelectBeginDate}
											callbackClearSelectBeginDate={handleClearSelectBeginDate}
											callbackSubmitSelectBeginDate={handleSubmitSelectBeginDate}
											callbackCancelSelectBeginDate={handleCancelSelectBeginDate}
										/>
									) : null
								}
								{
									Settings.maybeTaskTimeline(a) ? (
										<TaskTimelineEditor
											treeIndexes={[]}
											currentIndex={i}
											parentGroup={null}
											currentTimeline={a}
											timeRanges={timeRanges}
											draggingTimeline={draggingTimeline}
											selectingBeginDate={selectingBeginDate}
											callbackRefreshChildrenOrder={handleUpdateChildrenOrder}
											callbackRefreshChildrenBeginDate={handleUpdateChildrenBeginDate}
											callbackRefreshChildrenWorkload={handleUpdateChildrenWorkload}
											callbackRefreshChildrenProgress={() => { /*nop*/ }}
											callbackAddNextSiblingItem={handleAddNextSiblingItem}
											callbackDeleteChildTimeline={handleDeleteChildren}
											callbackDraggingTimeline={handleStartDragTimeline}
											callbackStartSelectBeginDate={handleStartSelectBeginDate}
											callbackClearSelectBeginDate={handleClearSelectBeginDate}
											callbackSubmitSelectBeginDate={handleSubmitSelectBeginDate}
											callbackCancelSelectBeginDate={handleCancelSelectBeginDate}
										/>
									) : null
								}
							</li>
						);
					})}
				</ul>

				<hr />

				<button type='button' onClick={handleAddNewGroup}>add new group</button>
				<button type='button' onClick={handleAddNewTask}>add new task</button>
			</>
		</div>
	);
};

export default Component;
