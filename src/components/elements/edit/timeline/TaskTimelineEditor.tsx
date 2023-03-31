import { NextPage } from "next";
import { useEffect, useState } from "react";

import { useLocale } from "@/models/locales/locale";

import MemberList from "./MemberList";
import { MemberId, TaskTimeline, Timeline, TimelineKind } from "@/models/data/Setting";
import { TimeSpan } from "@/models/TimeSpan";
import { Strings } from "@/models/Strings";
import { TimeRangeKind, TimeRanges } from "@/models/TimeRange";
import { EditProps } from "@/models/data/props/EditProps";
import { TimeLineEditorProps } from "@/models/data/props/TimeLineEditorProps";
import ProgressCell from "./cell/ProgressCell";
import WorkloadCell from "./cell/WorkloadCell";
import TimeRangeCells from "./cell/TimeRangeCells";
import SubjectCell from "./cell/SubjectCell";
import IdCell from "./cell/IdCell";
import TimelineHeaderRow from "./cell/TimelineHeaderRow";
import RelationCell from "./cell/RelationCell";
import ControlsCell, { MoveItemKind } from "./cell/ControlsCell";

interface Props extends EditProps, TimeLineEditorProps<TaskTimeline> {
	callbackAddNextSiblingItem: (kind: TimelineKind, currentTimeline: Timeline) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const selectingId = "timeline-node-previous-" + props.currentTimeline.id;

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [beginKind, setBeginKind] = useState<TimeRangeKind>("loading");
	const [beginDate, setBeginDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [workload, setWorkload] = useState(TimeSpan.parse(props.currentTimeline.workload).totalDays);
	const [memberId, setMemberId] = useState(props.currentTimeline.memberId);
	const [progressPercent, setProgressPercent] = useState(props.currentTimeline.progress * 100.0);
	//const [selectingBeginDate, setSelectingBeginDate] = useState(false);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);
	const [selectedBeginDate, setSelectedBeginDate] = useState(props.selectingBeginDate?.beginDate ?? null);

	useEffect(() => {
		const timeRange = props.timeRanges.get(props.currentTimeline.id);
		if (timeRange) {
			setBeginKind(timeRange.kind);
			if (TimeRanges.maybeSuccessTimeRange(timeRange)) {
				setBeginDate(timeRange.begin);
				setEndDate(timeRange.end);
			}
		}
	}, [props.timeRanges]);

	useEffect(() => {
		if (props.selectingBeginDate) {
			const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
			setIsSelectedPrevious(selected);

			setSelectedBeginDate(props.selectingBeginDate.beginDate ?? null);
		}
	}, [props.selectingBeginDate]);

	function handleChangeSubject(s: string) {
		setSubject(s);
		props.currentTimeline.subject = s;
	}

	function handleChangeWorkload(n: number) {
		setWorkload(n);
		props.currentTimeline.workload = TimeSpan.fromDays(n).toString("readable");

		props.refreshedChildrenCallbacks.updatedWorkload();
	}

	function handleChangeProgress(n: number) {
		setProgressPercent(n);
		props.currentTimeline.progress = n / 100.0;

		props.refreshedChildrenCallbacks.updatedProgress();
	}

	function handleControlMoveItem(kind: MoveItemKind) {
		props.notifyParentCallbacks.notifyMove(kind, props.currentTimeline);
	}

	function handleControlAddItem(kind: TimelineKind) {
		props.callbackAddNextSiblingItem(kind, props.currentTimeline);

		props.refreshedChildrenCallbacks.updatedWorkload();
		props.refreshedChildrenCallbacks.updatedProgress();
	}

	function handleControlDeleteItem() {
		props.notifyParentCallbacks.notifyDelete(props.currentTimeline);
	}

	function handleChangeMember(memberId: MemberId): void {
		setMemberId(memberId);
		props.currentTimeline.memberId = memberId;
		props.refreshedChildrenCallbacks.updateResource();
	}

	function handleClickBeginDate() {
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
		debugger;
		if (!props.currentIndex) {
			return;
		}

		const nodes = props.parentGroup ? props.parentGroup.children : props.editData.setting.timelineNodes;
		const prevTimeline = nodes[props.currentIndex - 1];
		props.beginDateCallbacks.setSelectBeginDate(props.currentTimeline, new Set([prevTimeline.id]));
	}

	function handleClearPrevious() {
		props.beginDateCallbacks.clearSelectBeginDate(props.currentTimeline, false, true);
	}

	function handleClearStatic() {
		props.beginDateCallbacks.clearSelectBeginDate(props.currentTimeline, true, false);
	}

	function handleSubmitPrevious() {
		if (!props.selectingBeginDate) {
			return;
		}

		props.currentTimeline.static = props.selectingBeginDate.beginDate ? Strings.formatDate(props.selectingBeginDate.beginDate, "yyyy-MM-dd") : undefined;
		props.currentTimeline.previous = [...props.selectingBeginDate.previous];

		props.beginDateCallbacks.submitSelectBeginDate(props.currentTimeline);
		props.refreshedChildrenCallbacks.updatedBeginDate();
	}

	function handleCancelPrevious() {
		props.beginDateCallbacks.cancelSelectBeginDate(props.currentTimeline)
	}

	return (
		<div className='task'>
			<TimelineHeaderRow
				level={props.treeIndexes.length + 1}
				currentTimeline={props.currentTimeline}
				selectingBeginDate={props.selectingBeginDate}
				draggingTimeline={props.draggingTimeline}
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
					callbackChangeValue={handleChangeWorkload}
				/>
				<div className='timeline-resource'>
					<MemberList
						groups={props.editData.setting.groups}
						selectedMemberId={memberId}
						disabled={props.selectingBeginDate !== null}
						callbackChangeMember={handleChangeMember}
					/>
				</div>
				<RelationCell
					currentTimeline={props.currentTimeline}
					selectable={props.selectingBeginDate !== null}
					htmlFor={selectingId}
				/>
				{
					props.selectingBeginDate && props.selectingBeginDate.timeline.id === props.currentTimeline.id
						? (
							<>
								<div className='timeline-range-area prompt'>
									<ul className="contents">
										<li className="main">
											<input
												type="date"
												value={selectedBeginDate ? Strings.formatDate(selectedBeginDate, "yyyy-MM-dd") : ''}
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
								callbackClickBeginDate={handleClickBeginDate}
							/>
						)
				}
				<ProgressCell
					readOnly={false}
					disabled={props.selectingBeginDate !== null}
					value={progressPercent}
					callbackChangeValue={handleChangeProgress}
				/>
				<ControlsCell
					currentTimelineKind="task"
					disabled={props.selectingBeginDate !== null}
					moveItem={handleControlMoveItem}
					addItem={handleControlAddItem}
					deleteItem={handleControlDeleteItem}
				/>
			</TimelineHeaderRow>
		</div >
	);
};

export default Component;
