import { NextPage } from "next";
import { useState, useEffect, DragEvent } from "react";

import Icon from "@/components/elements/Icon";
import ControlsCell from "@/components/elements/pages/editor/timeline/cell/ControlsCell";
import IdCell from "@/components/elements/pages/editor/timeline/cell/IdCell";
import ProgressCell from "@/components/elements/pages/editor/timeline/cell/ProgressCell";
import RelationCell from "@/components/elements/pages/editor/timeline/cell/RelationCell";
import ResourceCell from "@/components/elements/pages/editor/timeline/cell/ResourceCell";
import SubjectCell from "@/components/elements/pages/editor/timeline/cell/SubjectCell";
import TimelineHeaderRow from "@/components/elements/pages/editor/timeline/cell/TimelineHeaderRow";
import WorkloadCell from "@/components/elements/pages/editor/timeline/cell/WorkloadCell";
import WorkRangeCells from "@/components/elements/pages/editor/timeline/cell/WorkRangeCells";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { EditProps } from "@/models/data/props/EditProps";
import { AnyTimeline, GroupTimeline, MemberId, TimelineKind } from "@/models/data/Setting";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { IconKind } from "@/models/IconKind";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";
import { WorkRanges } from "@/models/WorkRanges";
import { Types } from "@/models/Types";

interface Props extends EditProps {
	currentTimeline: AnyTimeline;
	timelineStore: TimelineStore;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
	calendarInfo: CalendarInfo;
}

const Component: NextPage<Props> = (props: Props) => {
	const selectingId = Timelines.toNodePreviousId(props.currentTimeline);

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [workload, setWorkload] = useState(0);
	const [memberId, setMemberId] = useState(Settings.maybeTaskTimeline(props.currentTimeline) ? props.currentTimeline.memberId : "");
	const [beginKind, setBeginKind] = useState<WorkRangeKind>("loading");
	const [beginDate, setBeginDate] = useState<DateTime | null>(null);
	const [endDate, setEndDate] = useState<DateTime | null>(null);
	const [progress, setProgress] = useState(0);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);
	const [selectedBeginDate, setSelectedBeginDate] = useState(props.selectingBeginDate?.beginDate ?? null);

	//TODO: 依存関係が腐ってるよ！

	useEffect(() => {
		const timelineItem = props.timelineStore.changedItemMap.get(props.currentTimeline.id);
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

			if (timelineItem.workRange) {
				setBeginKind(timelineItem.workRange.kind);
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.workRange)) {
					setBeginDate(timelineItem.workRange.begin);
					setEndDate(timelineItem.workRange.end);
				}
			}
		}
	}, [props.currentTimeline, props.timelineStore]);

	useEffect(() => {
		if (props.selectingBeginDate) {
			if (Settings.maybeGroupTimeline(props.currentTimeline)) {
				const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
				setIsSelectedPrevious(selected);
			} else if (Settings.maybeTaskTimeline(props.currentTimeline)) {
				const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
				setIsSelectedPrevious(selected);

				setSelectedBeginDate(props.selectingBeginDate.beginDate ?? null);
			} else {
				throw new Error();
			}
		}
	}, [props.currentTimeline, props.selectingBeginDate]);

	function handleChangeSubject(s: string) {
		setSubject(s);
		props.currentTimeline.subject = s;
	}

	function handleChangeWorkload(n: number) {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		//setWorkload(n);
		//props.currentTimeline.workload = Timelines.serializeWorkload(TimeSpan.fromDays(n));
		const workload = Timelines.serializeWorkload(TimeSpan.fromDays(n));

		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			workload: workload,
		});
	}

	function handleChangeProgress(n: number) {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		const progress = n / 100.0;

		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			progress: progress,
		});
	}

	function handleControlMoveItem(moveUp: boolean) {
		props.timelineStore.moveTimeline(moveUp, props.currentTimeline);
	}

	function handleControlAddItem(kindOrTimeline: TimelineKind | GroupTimeline): void {
		if (kindOrTimeline === "group" || kindOrTimeline === "task") {
			// 空タイムライン
			props.timelineStore.addEmptyTimeline(
				props.currentTimeline,
				{
					position: NewTimelinePosition.Next,
					timelineKind: kindOrTimeline,
				}
			);
		} else {
			// グループ
			props.timelineStore.addNewTimeline(
				props.currentTimeline,
				kindOrTimeline,
				NewTimelinePosition.Next
			);
		}
	}

	function handleControlDeleteItem() {
		props.timelineStore.removeTimeline(props.currentTimeline);
	}

	function handleChangeMember(memberId: MemberId): void {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			memberId: memberId,
		});
	}

	function handleClickBeginDate() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		if (props.selectingBeginDate) {
			return;
		}

		props.beginDateCallbacks.startSelectBeginDate(props.currentTimeline);
	}

	function handleStartDragTimeline(ev: DragEvent): void {
		props.timelineStore.startDragTimeline(ev, props.currentTimeline);
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

		props.selectingBeginDate.beginDate = date ? DateTime.convert(date, props.calendarInfo.timeZone) : null;
		setSelectedBeginDate(props.selectingBeginDate.beginDate);
	}

	function handleAttachBeforeTimeline() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		const beforeTimeline = props.timelineStore.searchBeforeTimeline(props.currentTimeline);
		if (beforeTimeline) {
			props.beginDateCallbacks.setSelectBeginDate(props.currentTimeline, new Set([beforeTimeline.id]));
		}
	}

	function handleSubmitAttachBeforeTimeline() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		const beforeTimeline = props.timelineStore.searchBeforeTimeline(props.currentTimeline);
		if (beforeTimeline) {
			props.currentTimeline.static = undefined;
			props.currentTimeline.previous = [beforeTimeline.id];
		}

		props.beginDateCallbacks.submitSelectBeginDate(props.currentTimeline);
	}

	function handleClearPrevious() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.clearSelectBeginDate(props.currentTimeline, false, true);
	}

	function handleClearStatic() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.clearSelectBeginDate(props.currentTimeline, true, false);
	}

	function handleSubmitPrevious() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		if (!props.selectingBeginDate) {
			return;
		}

		props.currentTimeline.static = props.selectingBeginDate.beginDate ? props.selectingBeginDate.beginDate.format("yyyy-MM-dd") : undefined;
		props.currentTimeline.previous = [...props.selectingBeginDate.previous];

		props.beginDateCallbacks.submitSelectBeginDate(props.currentTimeline);
	}

	function handleCancelPrevious() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.cancelSelectBeginDate(props.currentTimeline);
	}

	const timelineIndex = props.timelineStore.getIndex(props.currentTimeline);

	return (
		<TimelineHeaderRow
			currentTimeline={props.currentTimeline}
			selectingBeginDate={props.selectingBeginDate}
			draggingTimeline={props.draggingTimeline}
			timelineStore={props.timelineStore}
			level={timelineIndex.level}
		>
			<IdCell
				selectingId={selectingId}
				timelineIndex={timelineIndex}
				currentTimeline={props.currentTimeline}
				isSelectedPrevious={isSelectedPrevious}
				draggingTimeline={props.draggingTimeline}
				selectingBeginDate={props.selectingBeginDate}
				callbackStartDragTimeline={handleStartDragTimeline}
				callbackChangePrevious={handleChangePrevious}
			/>
			<SubjectCell
				value={subject}
				disabled={Types.toBoolean(props.selectingBeginDate)}
				readOnly={false}
				callbackChangeValue={handleChangeSubject}
			/>
			<WorkloadCell
				readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
				disabled={Types.toBoolean(props.selectingBeginDate)}
				value={workload}
				callbackChangeValue={Settings.maybeTaskTimeline(props.currentTimeline) ? handleChangeWorkload : undefined}
			/>
			<ResourceCell
				currentTimeline={props.currentTimeline}
				groups={props.editData.setting.groups}
				selectedMemberId={memberId}
				disabled={Types.toBoolean(props.selectingBeginDate)}
				callbackChangeMember={handleChangeMember}
			/>
			<RelationCell
				currentTimeline={props.currentTimeline}
				selectable={Types.toBoolean(props.selectingBeginDate)}
				htmlFor={selectingId}
			/>
			{
				props.selectingBeginDate && props.selectingBeginDate.timeline.id === props.currentTimeline.id
					? (
						<td className='timeline-cell timeline-range-area prompt' colSpan={2}>
							<ul className="contents">
								<li className="main">
									<input
										type="date"
										value={selectedBeginDate ? selectedBeginDate.format("yyyy-MM-dd") : ""}
										onChange={ev => handleChangeSelectingBeginDate(ev.target.valueAsDate)}
									/>
								</li>
								<li>
									<button type="button" onClick={handleSubmitPrevious}>
										<Icon
											kind={IconKind.ConfirmPositive}
											fill="green"
											title="確定"
										/>
									</button>
								</li>
								<li>
									<button type="button" onClick={handleCancelPrevious}>
										<Icon
											kind={IconKind.ConfirmCancel}
											title="キャンセル"
										/>
									</button>
								</li>
							</ul>
							<div className="tools after">
								<fieldset>
									<legend>即時実行</legend>
									<ul>
										<li>
											<button onClick={handleSubmitAttachBeforeTimeline}>
												<Icon
													kind={IconKind.RelationJoin}
												/>
												直近項目に紐づける
											</button>
										</li>
									</ul>
								</fieldset>
								<fieldset>
									<legend>連続作業</legend>
									<ul>
										<li>
											<button onClick={handleAttachBeforeTimeline}>
												<Icon
													kind={IconKind.RelationJoin}
												/>
												直近項目に紐づける
											</button>
										</li>
										<li>
											<button onClick={handleClearPrevious}>
												<Icon
													kind={IconKind.RelationClear}
												/>
												紐づけを解除
											</button>
										</li>
										<li>
											<button onClick={handleClearStatic}>
												<Icon
													kind={IconKind.Clear}
												/>
												固定日付をクリア
											</button>
										</li>
									</ul>
								</fieldset>
							</div>
						</td>
					) : (
						<WorkRangeCells
							workRangeKind={beginKind}
							selectable={Types.toBoolean(props.selectingBeginDate)}
							beginDate={beginDate}
							endDate={endDate}
							htmlFor={selectingId}
							callbackClickBeginDate={Settings.maybeTaskTimeline(props.currentTimeline) ? handleClickBeginDate : undefined}
						/>
					)
			}
			<ProgressCell
				readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
				disabled={Types.toBoolean(props.selectingBeginDate)}
				progress={progress}
				callbackChangeValue={Settings.maybeTaskTimeline(props.currentTimeline) ? handleChangeProgress : undefined}
			/>
			<ControlsCell
				currentTimelineKind={props.currentTimeline.kind}
				disabled={Types.toBoolean(props.selectingBeginDate)}
				moveItem={handleControlMoveItem}
				addItem={handleControlAddItem}
				deleteItem={handleControlDeleteItem}
			/>
		</TimelineHeaderRow >
	);
};

export default Component;
