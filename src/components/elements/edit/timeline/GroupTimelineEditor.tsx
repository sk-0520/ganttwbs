import { NextPage } from "next";
import { useEffect, useState } from "react";

import { Timelines } from "@/models/Timelines";

import GroupTimelineEditor from "./GroupTimelineEditor";
import TaskTimelineEditor from "./TaskTimelineEditor";
import { GroupTimeline, TaskTimeline, Timeline, TimelineKind } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { DropTimeline } from "@/models/data/DropTimeline";
import { EditProps } from "@/models/data/props/EditProps";
import { TimeLineEditorProps } from "@/models/data/props/TimeLineEditorProps";
import ProgressCell from "./cell/ProgressCell";
import WorkloadCell from "./cell/WorkloadCell";
import TimeRangeCells from "./cell/TimeRangeCells";
import { RefreshedChildrenCallbacks } from "@/models/data/RefreshedChildrenCallbacks";
import { NotifyParentCallbacks } from "@/models/data/NotifyParentCallbacks";
import SubjectCell from "./cell/SubjectCell";
import IdCell from "./cell/IdCell";
import TimelineHeaderRow from "./cell/TimelineHeaderRow";
import RelationCell from "./cell/RelationCell";
import ControlsCell from "./cell/ControlsCell";
import { DateTimeRanges } from "@/models/DateTimeRanges";
import { DateTimeRangeKind } from "@/models/data/DateTimeRange";

interface Props extends EditProps, TimeLineEditorProps<GroupTimeline> {
	dropTimeline: DropTimeline | null;
}

const Component: NextPage<Props> = (props: Props) => {

	const selectingId = Timelines.toNodePreviousId(props.currentTimeline);

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [workload, setWorkload] = useState(Timelines.sumWorkloadByGroup(props.currentTimeline).totalDays);
	const [beginKind, setBeginKind] = useState<DateTimeRangeKind>("loading");
	const [beginDate, setBeginDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [progress, setProgress] = useState(Timelines.sumProgressByGroup(props.currentTimeline));
	const [children, setChildren] = useState(props.currentTimeline.children);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);

	useEffect(() => {
		const timelineItem = props.timelineStore.items.get(props.currentTimeline.id);
		if (timelineItem) {
			if (!Settings.maybeGroupTimeline(timelineItem.timeline)) {
				throw new Error(timelineItem.timeline.id + " - " + timelineItem.timeline.kind);
			}

			const workload = Timelines.sumWorkloadByGroup(timelineItem.timeline).totalDays;
			setWorkload(workload);

			const progress =  Timelines.sumProgressByGroup(timelineItem.timeline);
			setProgress(progress);

			if (timelineItem.range) {
				setBeginKind(timelineItem.range.kind);
				if (DateTimeRanges.maybeSuccessTimeRange(timelineItem.range)) {
					setBeginDate(timelineItem.range.begin);
					setEndDate(timelineItem.range.end);
				}
			}
		}
	}, [props.currentTimeline, props.timelineStore]);

	useEffect(() => {
		if (props.selectingBeginDate) {
			const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
			setIsSelectedPrevious(selected);
		}
	}, [props.selectingBeginDate]);

	useEffect(() => {
		if (props.dropTimeline) {
			const sourceIsSelf = props.dropTimeline.sourceGroupTimeline?.id === props.currentTimeline.id;
			const destinationIsSelf = props.dropTimeline.destinationGroupTimeline?.id === props.currentTimeline.id;
			console.debug("位置変更!", { sourceIsSelf, destinationIsSelf });

			// 自グループ内で完結する場合は移動するだけ
			if (sourceIsSelf && destinationIsSelf) {
				Timelines.moveTimelineIndex(props.currentTimeline.children, props.dropTimeline.sourceIndex, props.dropTimeline.destinationIndex);
				setChildren([...props.currentTimeline.children]);
			} else {
				// 移動元が自グループのため対象の子を破棄
				if (sourceIsSelf) {
					const nextTimelines = children.filter(a => a.id !== props.dropTimeline!.timeline.id);
					setChildren(props.currentTimeline.children = nextTimelines);
				}

				// 移動先が自グループのため対象の子を追加
				if (destinationIsSelf) {
					props.currentTimeline.children.splice(props.dropTimeline.destinationIndex, 0, props.dropTimeline.timeline);
					setChildren([...props.currentTimeline.children]);
				}
			}
		}
	}, [props.dropTimeline]);

	useEffect(() => {
		if (!props.draggingTimeline) {
			handleUpdateChildrenWorkload();
			handleUpdateChildrenProgress();

			props.timelineStore.updateTimeline(props.currentTimeline);
		}
	}, [props.draggingTimeline]);

	function handleChangeSubject(s: string) {
		setSubject(s);
		props.currentTimeline.subject = s;
	}

	function handleControlMoveItem(moveUp: boolean) {
		props.notifyParentCallbacks.notifyMove(moveUp, props.currentTimeline);
	}

	function handleControlAddItem(kind: TimelineKind) {
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

		setChildren([
			...children,
			item,
		]);
		props.currentTimeline.children.push(item);

		handleUpdateChildrenWorkload();
		handleUpdateChildrenProgress();

		props.timelineStore.updateTimeline(props.currentTimeline);
	}

	function handleControlDeleteItem() {
		props.notifyParentCallbacks.notifyDelete(props.currentTimeline);
	}

	function handleUpdateChildrenOrder(moveUp: boolean, currentTimeline: Timeline) {
		if (Timelines.moveTimelineOrder(props.currentTimeline.children, moveUp, currentTimeline)) {
			setChildren([...props.currentTimeline.children]);
		}
	}

	function handleAddNextSiblingItem(kind: TimelineKind, currentTimeline: Timeline): void {
		const currentIndex = children.findIndex(a => a === currentTimeline);

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

		props.currentTimeline.children.splice(currentIndex + 1, 0, item);
		setChildren([...props.currentTimeline.children]);

		props.timelineStore.updateTimeline(props.currentTimeline);
	}

	function handleUpdateChildrenBeginDate() {
		props.refreshedChildrenCallbacks.updatedBeginDate();
	}

	function handleUpdateChildrenResource() {
		props.refreshedChildrenCallbacks.updateResource();
	}

	function handleUpdateChildrenWorkload() {
		// const summary = Timelines.sumWorkloadByGroup(props.currentTimeline);
		// setWorkload(summary.totalDays);

		// props.timelineStore.updateTimeline(props.currentTimeline);
	}

	function handleUpdateChildrenProgress() {
		// const progress = Timelines.sumProgressByGroup(props.currentTimeline);
		// setProgressPercent(progress * 100.0);

		// props.timelineStore.updateTimeline(props.currentTimeline);
	}

	function handleDeleteChildren(currentTimeline: Timeline) {
		const nextTimelines = children.filter(a => a.id !== currentTimeline.id);
		setChildren(props.currentTimeline.children = nextTimelines);

		handleUpdateChildrenWorkload();
		handleUpdateChildrenProgress();

		props.timelineStore.updateTimeline(props.currentTimeline);
	}

	function handleChangePrevious(isSelected: boolean): void {
		if (!props.selectingBeginDate) {
			return;
		}

		if (isSelected) {
			props.selectingBeginDate.previous.add(props.currentTimeline.id);
		} else {
			props.selectingBeginDate.previous.delete(props.currentTimeline.id);
		}
		setIsSelectedPrevious(isSelected);
	}

	const notifyParentCallbacks: NotifyParentCallbacks = {
		notifyMove: handleUpdateChildrenOrder,
		notifyDelete: handleDeleteChildren,
		notifyDragStart: props.notifyParentCallbacks.notifyDragStart,
	};

	const refreshedChildrenCallbacks: RefreshedChildrenCallbacks = {
		updatedBeginDate: handleUpdateChildrenBeginDate,
		updateResource: handleUpdateChildrenResource,
	}

	return (
		<>
			<div className='group'>
				<TimelineHeaderRow
					currentTimeline={props.currentTimeline}
					selectingBeginDate={props.selectingBeginDate}
					draggingTimeline={props.draggingTimeline}
					level={props.treeIndexes.length + 1}
				>
					<IdCell
						selectingId={selectingId}
						treeIndexes={props.treeIndexes}
						currentIndex={props.currentIndex}
						currentTimeline={props.currentTimeline}
						isSelectedPrevious={isSelectedPrevious}
						draggingTimeline={props.draggingTimeline}
						notifyParentCallbacks={props.notifyParentCallbacks}
						selectingBeginDate={props.selectingBeginDate}
						callbackChangePrevious={handleChangePrevious}
					/>
					<SubjectCell
						value={subject}
						disabled={props.selectingBeginDate !== null}
						readOnly={false}
						callbackChangeValue={handleChangeSubject}
					/>
					<WorkloadCell
						readOnly={true}
						disabled={props.selectingBeginDate !== null}
						value={workload}
					/>
					<div className='timeline-cell timeline-resource'>
					</div>
					<RelationCell
						currentTimeline={props.currentTimeline}
						selectable={props.selectingBeginDate !== null}
						htmlFor={selectingId}
					/>
					<TimeRangeCells
						timeRangeKind={beginKind}
						selectable={props.selectingBeginDate !== null}
						beginDate={beginDate}
						endDate={endDate}
						htmlFor={selectingId}
					/>
					<ProgressCell
						readOnly={true}
						disabled={props.selectingBeginDate !== null}
						progress={progress}
					/>
					<ControlsCell
						currentTimelineKind="group"
						disabled={props.selectingBeginDate !== null}
						moveItem={handleControlMoveItem}
						addItem={handleControlAddItem}
						deleteItem={handleControlDeleteItem}
					/>
				</TimelineHeaderRow>
			</div >
			{props.currentTimeline.children.length ? (
				<ul>
					{props.currentTimeline.children.map((a, i) => {
						return (
							<li key={a.id}>
								{
									Settings.maybeGroupTimeline(a) ? (
										<GroupTimelineEditor
											configuration={props.configuration}
											editData={props.editData}
											treeIndexes={[...props.treeIndexes, props.currentIndex]}
											currentIndex={i}
											parentGroup={props.currentTimeline}
											currentTimeline={a}
											timelineStore={props.timelineStore}
											draggingTimeline={props.draggingTimeline}
											dropTimeline={props.dropTimeline}
											selectingBeginDate={props.selectingBeginDate}
											notifyParentCallbacks={notifyParentCallbacks}
											refreshedChildrenCallbacks={refreshedChildrenCallbacks}
											beginDateCallbacks={props.beginDateCallbacks}
										/>
									) : null
								}
								{
									Settings.maybeTaskTimeline(a) ? (
										<TaskTimelineEditor
											configuration={props.configuration}
											editData={props.editData}
											treeIndexes={[...props.treeIndexes, props.currentIndex]}
											currentIndex={i}
											parentGroup={props.currentTimeline}
											currentTimeline={a}
											timelineStore={props.timelineStore}
											draggingTimeline={props.draggingTimeline}
											selectingBeginDate={props.selectingBeginDate}
											callbackAddNextSiblingItem={handleAddNextSiblingItem}
											notifyParentCallbacks={notifyParentCallbacks}
											refreshedChildrenCallbacks={refreshedChildrenCallbacks}
											beginDateCallbacks={props.beginDateCallbacks}
										/>
									) : null
								}
							</li>
						);
					})}
				</ul>
			) : null}
		</>
	);
};

export default Component;
