import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { NotifyParentCallbacks } from "@/models/data/NotifyParentCallbacks";
import { RefreshedChildrenCallbacks } from "@/models/data/RefreshedChildrenCallbacks";
import { AnyTimeline, GroupTimeline, MemberId, TaskTimeline, Timeline, TimelineKind } from "@/models/data/Setting";
import { EditProps } from "@/models/data/props/EditProps";
import { TimelineStore } from "@/models/store/TimelineStore";
import { NextPage } from "next";
import TimelineHeaderRow from "./cell/TimelineHeaderRow";
import ControlsCell from "./cell/ControlsCell";
import { DateTimeRanges } from "@/models/DateTimeRanges";
import { Dates } from "@/models/Dates";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";
import { Timelines } from "@/models/Timelines";
import { DateTimeRangeKind } from "@/models/data/DateTimeRange";
import { useState, useEffect } from "react";
import IdCell from "./cell/IdCell";
import ProgressCell from "./cell/ProgressCell";
import RelationCell from "./cell/RelationCell";
import ResourceCell from "./cell/ResourceCell";
import SubjectCell from "./cell/SubjectCell";
import TimeRangeCells from "./cell/TimeRangeCells";
import WorkloadCell from "./cell/WorkloadCell";
import { DropTimeline } from "@/models/data/DropTimeline";

interface Props extends EditProps {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: AnyTimeline;
	timelineStore: TimelineStore;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	notifyParentCallbacks: NotifyParentCallbacks;
	refreshedChildrenCallbacks: RefreshedChildrenCallbacks;
	beginDateCallbacks: BeginDateCallbacks;
	dropTimeline: DropTimeline | null;
	callbackAddNextSiblingItem(kind: TimelineKind, currentTimeline: Timeline): void;
}

const Component: NextPage<Props> = (props: Props) => {
	const selectingId = Timelines.toNodePreviousId(props.currentTimeline);

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [workload, setWorkload] = useState(0);
	const [memberId, setMemberId] = useState(Settings.maybeTaskTimeline(props.currentTimeline) ? props.currentTimeline.memberId : "");
	const [beginKind, setBeginKind] = useState<DateTimeRangeKind>("loading");
	const [beginDate, setBeginDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [progress, setProgress] = useState(0);
	const [children, setChildren] = useState(Settings.maybeGroupTimeline(props.currentTimeline) ? props.currentTimeline.children : []);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);
	const [selectedBeginDate, setSelectedBeginDate] = useState(props.selectingBeginDate?.beginDate ?? null);

	useEffect(() => {
		const timelineItem = props.timelineStore.items.get(props.currentTimeline.id);
		if (timelineItem) {

			if (Settings.maybeGroupTimeline(timelineItem.timeline)) {
				const workload = Timelines.sumWorkloadByGroup(timelineItem.timeline).totalDays;
				setWorkload(workload);

				const progress = Timelines.sumProgressByGroup(timelineItem.timeline);
				setProgress(progress);

			} else if (Settings.maybeTaskTimeline(timelineItem.timeline)) {
				const workload = TimeSpan.parse(timelineItem.timeline.workload).totalDays;
				setWorkload(workload);

				const progress = timelineItem.timeline.progress;
				setProgress(progress);

				const memberId = timelineItem.timeline.memberId;
				setMemberId(memberId);
			} else {
				throw new Error();
			}

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
			if(Settings.maybeGroupTimeline(props.currentTimeline)) {
				const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
				setIsSelectedPrevious(selected);
			} else if(Settings.maybeTaskTimeline(props.currentTimeline)) {
				const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
				setIsSelectedPrevious(selected);

				setSelectedBeginDate(props.selectingBeginDate.beginDate ?? null);
			} else {
				throw new Error();
			}
		}
	}, [props.selectingBeginDate]);

	useEffect(() => {
		if (props.dropTimeline && Settings.maybeGroupTimeline(props.currentTimeline)) {
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
		if (Settings.maybeGroupTimeline(props.currentTimeline)) {
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
		} else if (Settings.maybeTaskTimeline(props.currentTimeline)) {
			props.callbackAddNextSiblingItem(kind, props.currentTimeline);

			//props.refreshedChildrenCallbacks.updatedWorkload();
			//props.refreshedChildrenCallbacks.updatedProgress();
			props.timelineStore.updateTimeline(props.currentTimeline);
		} else {
			throw new Error();
		}
	}

	function handleControlDeleteItem() {
		props.notifyParentCallbacks.notifyDelete(props.currentTimeline);
	}

	function handleChangeMember(memberId: MemberId): void {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		//setMemberId(memberId);
		//props.currentTimeline.memberId = memberId;
		//props.refreshedChildrenCallbacks.updateResource();
		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			memberId: memberId,
		});
	}

	function handleUpdateChildrenOrder(moveUp: boolean, currentTimeline: Timeline) {
		if (Settings.maybeGroupTimeline(props.currentTimeline)) {
			if (Timelines.moveTimelineOrder(props.currentTimeline.children, moveUp, currentTimeline)) {
				setChildren([...props.currentTimeline.children]);
			}
		} else if (Settings.maybeTaskTimeline(props.currentTimeline)) {
			props.notifyParentCallbacks.notifyDelete(props.currentTimeline);
		} else {
			throw new Error();
		}
	}

	function handleAddNextSiblingItem(kind: TimelineKind, currentTimeline: Timeline): void {
		if (!Settings.maybeGroupTimeline(props.currentTimeline)) {
			throw new Error();
		}

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
		if (!Settings.maybeGroupTimeline(props.currentTimeline)) {
			throw new Error();
		}

		const nextTimelines = children.filter(a => a.id !== currentTimeline.id);
		setChildren(props.currentTimeline.children = nextTimelines);

		handleUpdateChildrenWorkload();
		handleUpdateChildrenProgress();

		props.timelineStore.updateTimeline(props.currentTimeline);
	}

	function handleClickBeginDate() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		if (props.selectingBeginDate) {
			return;
		}

		//setSelectingBeginDate(true);
		props.beginDateCallbacks.startSelectBeginDate(props.currentTimeline);
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

	function handleChangeSelectingBeginDate(date: Date | null): void {
		if (!props.selectingBeginDate) {
			return;
		}

		props.selectingBeginDate.beginDate = date;
		setSelectedBeginDate(date);
	}

	function handleAttachPrevTimeline() {
		if(!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		if (!props.currentIndex) {
			return;
		}

		const nodes = props.parentGroup ? props.parentGroup.children : props.editData.setting.timelineNodes;
		const prevTimeline = nodes[props.currentIndex - 1];
		props.beginDateCallbacks.setSelectBeginDate(props.currentTimeline, new Set([prevTimeline.id]));
	}

	function handleClearPrevious() {
		if(!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.clearSelectBeginDate(props.currentTimeline, false, true);
	}

	function handleClearStatic() {
		if(!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.clearSelectBeginDate(props.currentTimeline, true, false);
	}

	function handleSubmitPrevious() {
		if(!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		if (!props.selectingBeginDate) {
			return;
		}

		props.currentTimeline.static = props.selectingBeginDate.beginDate ? Dates.format(props.selectingBeginDate.beginDate, "yyyy-MM-dd") : undefined;
		props.currentTimeline.previous = [...props.selectingBeginDate.previous];

		props.beginDateCallbacks.submitSelectBeginDate(props.currentTimeline);
		props.refreshedChildrenCallbacks.updatedBeginDate();
	}

	function handleCancelPrevious() {
		if(!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.cancelSelectBeginDate(props.currentTimeline)
	}

	const notifyParentCallbacks: NotifyParentCallbacks = {
		notifyMove: handleUpdateChildrenOrder,
		notifyDelete: handleDeleteChildren,
		notifyDragStart: props.notifyParentCallbacks.notifyDragStart,
	};

	const refreshedChildrenCallbacks: RefreshedChildrenCallbacks = {
		updatedBeginDate: handleUpdateChildrenBeginDate,
		//updateResource: handleUpdateChildrenResource,
	}

	const className = props.currentTimeline.kind;

	return (
		<>
			<div className={className}>
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
						readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
						callbackChangeValue={handleChangeSubject}
					/>
					<WorkloadCell
						readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
						disabled={props.selectingBeginDate !== null}
						value={workload}
					/>
					<ResourceCell
						currentTimeline={props.currentTimeline}
						groups={props.editData.setting.groups}
						selectedMemberId=""
						disabled={props.selectingBeginDate !== null}
						callbackChangeMember={handleChangeMember}
					/>
					<RelationCell
						currentTimeline={props.currentTimeline}
						selectable={props.selectingBeginDate !== null}
						htmlFor={selectingId}
					/>
					{
						props.selectingBeginDate && props.selectingBeginDate.timeline.id === props.currentTimeline.id
							? (
								<>
									<div className='timeline-cell timeline-range-area prompt'>
										<ul className="contents">
											<li className="main">
												<input
													type="date"
													value={selectedBeginDate ? Dates.format(selectedBeginDate, "yyyy-MM-dd") : ""}
													onChange={ev => handleChangeSelectingBeginDate(ev.target.valueAsDate)}
												/>
											</li>
											<li><button type="button" onClick={handleSubmitPrevious}>更新</button></li>
											<li><button type="button" onClick={handleCancelPrevious}>取消</button></li>
										</ul>
										<div className="tools after">
											<ul>
												<li><button onClick={handleAttachPrevTimeline}>直近項目に紐づける</button></li>
												<li><button onClick={handleClearPrevious}>紐づけを解除</button></li>
												<li><button onClick={handleClearStatic}>固定日付をクリア</button></li>
											</ul>
										</div>
									</div>
								</>
							) : (
								<TimeRangeCells
									timeRangeKind={beginKind}
									selectable={props.selectingBeginDate !== null}
									beginDate={beginDate}
									endDate={endDate}
									htmlFor={selectingId}
									callbackClickBeginDate={Settings.maybeTaskTimeline(props.currentTimeline) ? handleClickBeginDate: undefined}
								/>
							)
					}
					<ProgressCell
						readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
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
			{Settings.maybeGroupTimeline(props.currentTimeline) && props.currentTimeline.children.length ? (
				<ul>
					{props.currentTimeline.children.map((a, i) => {
						return (
							<li key={a.id}>
								<Component
									configuration={props.configuration}
									editData={props.editData}
									treeIndexes={[...props.treeIndexes, props.currentIndex]}
									currentIndex={i}
									parentGroup={props.currentTimeline as GroupTimeline}
									currentTimeline={a}
									timelineStore={props.timelineStore}
									draggingTimeline={props.draggingTimeline}
									dropTimeline={props.dropTimeline}
									selectingBeginDate={props.selectingBeginDate}
									notifyParentCallbacks={notifyParentCallbacks}
									refreshedChildrenCallbacks={refreshedChildrenCallbacks}
									beginDateCallbacks={props.beginDateCallbacks}
									callbackAddNextSiblingItem={handleAddNextSiblingItem}
								/>
								{/* {
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
								} */}
							</li>
						);
					})}
				</ul>
			) : null}
		</>
	);
};

export default Component;
