import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";

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

// interface Props {
// }

//const Component: NextPage<Props> = (props: Props) => {
const Component: NextPage = () => {
	const locale = useLocale();
	const editContext = useContext(EditContext);

	const [timelines, setTimelines] = useState(editContext.data.setting.timelineNodes);
	const [timeRanges, setTimeRanges] = useState<Map<TimelineId, TimeRange>>(new Map());
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
											selectingBeginDate={selectingBeginDate}
											callbackRefreshChildrenOrder={handleUpdateChildrenOrder}
											callbackRefreshChildrenBeginDate={handleUpdateChildrenBeginDate}
											callbackRefreshChildrenWorkload={handleUpdateChildrenWorkload}
											callbackRefreshChildrenProgress={() => { /*nop*/ }}
											callbackDeleteChildTimeline={handleDeleteChildren}
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
											selectingBeginDate={selectingBeginDate}
											callbackRefreshChildrenOrder={handleUpdateChildrenOrder}
											callbackRefreshChildrenBeginDate={handleUpdateChildrenBeginDate}
											callbackRefreshChildrenWorkload={handleUpdateChildrenWorkload}
											callbackRefreshChildrenProgress={() => { /*nop*/ }}
											callbackAddNextSiblingItem={handleAddNextSiblingItem}
											callbackDeleteChildTimeline={handleDeleteChildren}
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
