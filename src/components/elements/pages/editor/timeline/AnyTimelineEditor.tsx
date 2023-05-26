import { useState, useEffect, DragEvent, FC, useCallback, KeyboardEvent, useRef } from "react";

import { IconImage, IconKind, IconLabel } from "@/components/elements/Icon";
import ControlsCell from "@/components/elements/pages/editor/timeline/cell/ControlsCell";
import IdCell from "@/components/elements/pages/editor/timeline/cell/IdCell";
import ProgressCell from "@/components/elements/pages/editor/timeline/cell/ProgressCell";
import RelationCell from "@/components/elements/pages/editor/timeline/cell/RelationCell";
import ResourceCell from "@/components/elements/pages/editor/timeline/cell/ResourceCell";
import SubjectCell from "@/components/elements/pages/editor/timeline/cell/SubjectCell";
import TimelineHeaderRow from "@/components/elements/pages/editor/timeline/cell/TimelineHeaderRow";
import WorkloadCell from "@/components/elements/pages/editor/timeline/cell/WorkloadCell";
import WorkRangeCells from "@/components/elements/pages/editor/timeline/cell/WorkRangeCells";
import { useLocale } from "@/locales/locale";
import { useSelectingBeginDateAtomReader, useSelectingBeginDateAtomWriter } from "@/models/atom/editor/BeginDateAtoms";
import { useDetailEditTimelineAtomWriter, useDragSourceTimelineAtomWriter } from "@/models/atom/editor/DragAndDropAtoms";
import { useActiveTimelineIdAtomWriter, useHighlightDaysAtomWriter, useHighlightTimelineIdsAtomWriter, useHoverTimelineIdAtomWriter } from "@/models/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useTimelineItemsAtomReader, useWorkRangesAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { BeginDateCallbacks } from "@/models/data/BeginDate";
import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline, GroupTimeline, Progress, TaskTimeline, TimelineKind } from "@/models/data/Setting";
import { MoveDirection } from "@/models/data/TimelineCallbacks";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Editors } from "@/models/Editors";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	currentTimeline: AnyTimeline;
	beginDateCallbacks: BeginDateCallbacks;
	callbackSubjectKeyDown(ev: KeyboardEvent, currentTimeline: AnyTimeline): void;
	callbackWorkloadKeyDown(ev: KeyboardEvent, currentTimeline: AnyTimeline): void;
}

const AnyTimelineEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const selectingId = Timelines.toNodePreviousId(props.currentTimeline);

	const detailEditTimelineAtomWriter = useDetailEditTimelineAtomWriter();

	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const highlightTimelineIdsAtomWriter = useHighlightTimelineIdsAtomWriter();
	const highlightDaysAtomWriter = useHighlightDaysAtomWriter();
	const activeTimelineIdAtomWriter = useActiveTimelineIdAtomWriter();
	const dragSourceTimelineAtomWriter = useDragSourceTimelineAtomWriter();
	const timelineItemsAtomReader = useTimelineItemsAtomReader();
	const workRangesAtomReader = useWorkRangesAtomReader();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();
	const selectingBeginDateAtomReader = useSelectingBeginDateAtomReader();
	const selectingBeginDateAtomWriter = useSelectingBeginDateAtomWriter();

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [workload, setWorkload] = useState(0);
	const [memberId, setMemberId] = useState(Settings.maybeTaskTimeline(props.currentTimeline) ? props.currentTimeline.memberId : "");
	const [workRangeKind, setWorkRangeKind] = useState(WorkRangeKind.Loading);
	const [beginDate, setBeginDate] = useState<DateTime | null>(null);
	const [endDate, setEndDate] = useState<DateTime | null>(null);
	const [progress, setProgress] = useState(0);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(selectingBeginDateAtomReader.data?.previous.has(props.currentTimeline.id) ?? false);
	const [selectedBeginDate, setSelectedBeginDate] = useState(selectingBeginDateAtomReader.data?.beginDate ?? null);
	const [visibleBeginDateInput, setVisibleBeginDateInput] = useState(false);
	const refInputDate = useRef<HTMLInputElement>(null);

	const isCompletedTask = Settings.maybeTaskTimeline(props.currentTimeline) && Timelines.isCompleted(props.currentTimeline.progress);

	useEffect(() => {
		if (refInputDate.current) {
			refInputDate.current.focus();
		}
	}, [refInputDate]);

	useEffect(() => {
		const timelineItem = timelineItemsAtomReader.data.get(props.currentTimeline.id);
		if (timelineItem) {
			setSubject(timelineItem.timeline.subject);

			if (Settings.maybeGroupTimeline(timelineItem.timeline)) {
				const workload = Timelines.sumWorkloadByGroup(timelineItem.timeline).totalDays;
				setWorkload(workload);

				const progress = Timelines.sumProgressByGroup(timelineItem.timeline);
				setProgress(progress);

			} else if (Settings.maybeTaskTimeline(timelineItem.timeline)) {
				const workload = Timelines.deserializeWorkload(timelineItem.timeline.workload).totalDays;
				setWorkload(workload);

				const progress = timelineItem.timeline.progress;
				setProgress(progress);

				const memberId = timelineItem.timeline.memberId;
				setMemberId(memberId);
			} else {
				throw new Error();
			}

			if (timelineItem.workRange) {
				setWorkRangeKind(timelineItem.workRange.kind);
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.workRange)) {
					setBeginDate(timelineItem.workRange.begin);
					setEndDate(timelineItem.workRange.end);
				}
			}
		}
	}, [props.currentTimeline, props.timelineCallbacks, timelineItemsAtomReader.data]);

	useEffect(() => {
		const isVisibleBeginDateInput = Boolean(selectingBeginDateAtomReader.data && selectingBeginDateAtomReader.data.timeline.id === props.currentTimeline.id);
		setVisibleBeginDateInput(isVisibleBeginDateInput);
		if (isVisibleBeginDateInput) {
			handleFocus(false);
			hoverTimelineIdAtomWriter.write(undefined);
		}
	}, [props.currentTimeline.id, selectingBeginDateAtomReader.data]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (selectingBeginDateAtomReader.data) {
			if (Settings.maybeGroupTimeline(props.currentTimeline)) {
				const selected = selectingBeginDateAtomReader.data.previous.has(props.currentTimeline.id);
				setIsSelectedPrevious(selected);
			} else if (Settings.maybeTaskTimeline(props.currentTimeline)) {
				const selected = selectingBeginDateAtomReader.data.previous.has(props.currentTimeline.id);
				setIsSelectedPrevious(selected);

				setSelectedBeginDate(selectingBeginDateAtomReader.data.beginDate ?? null);
			} else {
				throw new Error();
			}
		}
	}, [props.currentTimeline, selectingBeginDateAtomReader.data]);

	const onSubjectKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
		props.callbackSubjectKeyDown(ev, props.currentTimeline);
	}, [props]);

	const handleWorkloadKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
		props.callbackWorkloadKeyDown(ev, props.currentTimeline);
	}, [props]);


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

		props.timelineCallbacks.updateTimeline({
			...props.currentTimeline,
			workload: workload,
		});
	}

	function handleChangeProgress(progress: Progress) {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		//const progress = n / 100.0;

		props.timelineCallbacks.updateTimeline({
			...props.currentTimeline,
			progress: progress,
		});
	}

	function handleControlMoveItem(direction: MoveDirection) {
		props.timelineCallbacks.moveTimeline(direction, props.currentTimeline);
	}

	function handleControlAddItem(kindOrTimeline: TimelineKind | GroupTimeline): void {
		if (kindOrTimeline === "group" || kindOrTimeline === "task") {
			// 空タイムライン
			props.timelineCallbacks.addEmptyTimeline(
				props.currentTimeline,
				{
					position: NewTimelinePosition.Next,
					timelineKind: kindOrTimeline,
				}
			);
		} else {
			// グループ
			props.timelineCallbacks.addNewTimeline(
				props.currentTimeline,
				kindOrTimeline,
				NewTimelinePosition.Next
			);
		}
	}

	function handleControlDeleteItem() {
		props.timelineCallbacks.removeTimeline(props.currentTimeline);
	}

	function handleShowDetail() {
		detailEditTimelineAtomWriter.write(props.currentTimeline);
	}

	function handleShowTimeline(): void {
		let date: DateTime | undefined = undefined;
		const workRange = workRangesAtomReader.data.get(props.currentTimeline.id);
		if (workRange && WorkRanges.maybeSuccessWorkRange(workRange)) {
			date = workRange.begin;
		}

		highlightTimelineIdsAtomWriter.write([props.currentTimeline.id]);
		highlightDaysAtomWriter.write(date ? [date] : []);

		Editors.scrollView(props.currentTimeline.id, date);
	}

	function handleChangeMember(memberGroupPair: MemberGroupPair | undefined): void {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.timelineCallbacks.updateTimeline({
			...props.currentTimeline,
			memberId: memberGroupPair?.member.id ?? "",
		});
	}

	function handleClickBeginDate() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		if (selectingBeginDateAtomReader.data) {
			return;
		}

		props.beginDateCallbacks.startSelectBeginDate(props.currentTimeline);
	}

	function handleStartDragTimeline(ev: DragEvent): void {
		//props.timelineStore.startDragTimeline(ev, props.currentTimeline);
		dragSourceTimelineAtomWriter.write(props.currentTimeline);
	}

	function handleChangePrevious(isSelected: boolean): void {
		if (!selectingBeginDateAtomReader.data) {
			return;
		}

		if (isSelected) {
			selectingBeginDateAtomReader.data.previous.add(props.currentTimeline.id);
		} else {
			selectingBeginDateAtomReader.data.previous.delete(props.currentTimeline.id);
		}
		setIsSelectedPrevious(isSelected);
	}

	function handleChangeSelectingBeginDate(date: Date | null): void {
		if (!selectingBeginDateAtomReader.data) {
			return;
		}

		selectingBeginDateAtomWriter.write(c => {
			if (!c) {
				throw new Error();
			}

			return {
				...c,
				beginDate: date ? DateTime.convert(date, calendarInfoAtomReader.data.timeZone) : null,
			};
		});
		setSelectedBeginDate(selectingBeginDateAtomReader.data.beginDate);
	}

	function handleAttachBeforeTimeline() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		const beforeTimeline = props.timelineCallbacks.searchBeforeTimeline(props.currentTimeline);
		if (beforeTimeline) {
			props.beginDateCallbacks.setSelectBeginDate(props.currentTimeline, new Set([beforeTimeline.id]));
		}
	}

	function handleSubmitAttachBeforeTimeline() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		const timeline: TaskTimeline = {
			...props.currentTimeline,
		};

		const beforeTimeline = props.timelineCallbacks.searchBeforeTimeline(timeline);
		if (beforeTimeline) {
			timeline.static = undefined;
			timeline.previous = [beforeTimeline.id];
		}

		props.beginDateCallbacks.submitSelectBeginDate(timeline);
		handleFocus(false);
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

		if (!selectingBeginDateAtomReader.data) {
			return;
		}

		const timeline: TaskTimeline = {
			...props.currentTimeline,
			static: selectingBeginDateAtomReader.data.beginDate ? selectingBeginDateAtomReader.data.beginDate.format("yyyy-MM-dd") : undefined,
			previous: [...selectingBeginDateAtomReader.data.previous],
		};

		props.beginDateCallbacks.submitSelectBeginDate(timeline);
		handleFocus(false);
	}

	function handleCancelPrevious() {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.beginDateCallbacks.cancelSelectBeginDate(props.currentTimeline);
		handleFocus(false);
	}

	function handleFocus(isFocus: boolean): void {
		if (isFocus) {
			activeTimelineIdAtomWriter.write(props.currentTimeline.id);
		} else {
			activeTimelineIdAtomWriter.write(undefined);
		}
	}

	const timelineIndex = props.timelineCallbacks.calcReadableTimelineId(props.currentTimeline);

	return (
		<TimelineHeaderRow
			currentTimeline={props.currentTimeline}
			timelineCallbacks={props.timelineCallbacks}
			level={timelineIndex.level}
			isCompletedTask={isCompletedTask}
		>
			<IdCell
				selectingId={selectingId}
				readableTimelineId={timelineIndex}
				currentTimeline={props.currentTimeline}
				progress={progress}
				isSelectedPrevious={isSelectedPrevious}
				callbackStartDragTimeline={handleStartDragTimeline}
				callbackChangePrevious={handleChangePrevious}
			/>
			<SubjectCell
				timeline={props.currentTimeline}
				value={subject}
				disabled={Boolean(selectingBeginDateAtomReader.data)}
				readOnly={isCompletedTask}
				callbackChangeValue={handleChangeSubject}
				callbackFocus={handleFocus}
				callbackKeyDown={onSubjectKeyDown}
			/>
			<WorkloadCell
				timeline={props.currentTimeline}
				readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
				disabled={Boolean(selectingBeginDateAtomReader.data) || isCompletedTask}
				value={workload}
				callbackChangeValue={Settings.maybeTaskTimeline(props.currentTimeline) ? handleChangeWorkload : undefined}
				callbackFocus={handleFocus}
				callbackKeyDown={handleWorkloadKeyDown}
			/>
			<ResourceCell
				currentTimeline={props.currentTimeline}
				selectedMemberId={memberId}
				disabled={Boolean(selectingBeginDateAtomReader.data) || isCompletedTask}
				callbackChangeMember={handleChangeMember}
				callbackFocus={handleFocus}
			/>
			<RelationCell
				currentTimeline={props.currentTimeline}
				selectable={Boolean(selectingBeginDateAtomReader.data)}
				htmlFor={selectingId}
			/>
			{
				visibleBeginDateInput
					? (
						<td className="timeline-cell timeline-range-area prompt" colSpan={2}>
							<ul className="contents">
								<li className="main">
									<input
										ref={refInputDate}
										type="date"
										value={selectedBeginDate ? selectedBeginDate.toHtml("input-date") : ""}
										onChange={ev => handleChangeSelectingBeginDate(ev.target.valueAsDate)}
									/>
								</li>
								<li>
									<button
										type="button"
										title={locale.common.dialog.submit}
										onClick={handleSubmitPrevious}
									>
										<IconImage
											kind={IconKind.ConfirmPositive}
											fill="green"
										/>
									</button>
								</li>
								<li>
									<button
										type="button"
										title={locale.common.dialog.cancel}
										onClick={handleCancelPrevious}
									>
										<IconImage
											kind={IconKind.ConfirmCancel}
										/>
									</button>
								</li>
							</ul>
							<div className="tools after">
								<fieldset>
									<legend>
										{locale.pages.editor.timeline.timelines.range.immediate.title}
									</legend>
									<ul>
										<li>
											<button onClick={handleSubmitAttachBeforeTimeline}>
												<IconLabel
													kind={IconKind.RelationJoin}
													label={locale.pages.editor.timeline.timelines.range.immediate.attachBeforeTimeline}
												/>
											</button>
										</li>
									</ul>
								</fieldset>
								<fieldset>
									<legend>
										{locale.pages.editor.timeline.timelines.range.continue.title}
									</legend>
									<ul>
										<li>
											<button onClick={handleAttachBeforeTimeline}>
												<IconLabel
													kind={IconKind.RelationJoin}
													label={locale.pages.editor.timeline.timelines.range.continue.attachBeforeTimeline}
												/>
											</button>
										</li>
										<li>
											<button onClick={handleClearPrevious}>
												<IconLabel
													kind={IconKind.RelationClear}
													label={locale.pages.editor.timeline.timelines.range.continue.clearRelation}
												/>
											</button>
										</li>
										<li>
											<button onClick={handleClearStatic}>
												<IconLabel
													kind={IconKind.Clear}
													label={locale.pages.editor.timeline.timelines.range.continue.clearDate}
												/>
											</button>
										</li>
									</ul>
								</fieldset>
							</div>
						</td>
					) : (
						<WorkRangeCells
							workRangeKind={workRangeKind}
							selectable={Boolean(selectingBeginDateAtomReader.data)}
							beginDate={beginDate}
							endDate={endDate}
							htmlFor={selectingId}
							callbackClickBeginDate={Settings.maybeTaskTimeline(props.currentTimeline) && !isCompletedTask ? handleClickBeginDate : undefined}
						/>
					)
			}
			<ProgressCell
				readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
				disabled={Boolean(selectingBeginDateAtomReader.data) || isCompletedTask}
				progress={progress}
				callbackChangeValue={Settings.maybeTaskTimeline(props.currentTimeline) ? handleChangeProgress : undefined}
				callbackFocus={handleFocus}
			/>
			<ControlsCell
				currentTimelineKind={props.currentTimeline.kind}
				disabled={Boolean(selectingBeginDateAtomReader.data)}
				callbackMoveItem={handleControlMoveItem}
				callbackAddItem={handleControlAddItem}
				callbackDeleteItem={handleControlDeleteItem}
				callbackShowDetail={handleShowDetail}
				callbackShowTimeline={handleShowTimeline}
			/>
		</TimelineHeaderRow>
	);
};

export default AnyTimelineEditor;
