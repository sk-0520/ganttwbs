import { useAtomValue, useSetAtom } from "jotai";
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
import { DetailEditTimelineAtom, DragSourceTimelineAtom } from "@/models/data/atom/editor/DragAndDropAtoms";
import { ActiveTimelineIdAtom, HighlightDaysAtom, HighlightTimelineIdsAtom, HoverTimelineIdAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { TimelineItemsAtom, useCalendarInfoAtomReader, WorkRangesAtom } from "@/models/data/atom/editor/TimelineAtoms";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline, GroupTimeline, Progress, TimelineKind } from "@/models/data/Setting";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Editors } from "@/models/Editors";
import { Settings } from "@/models/Settings";
import { MoveDirection } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps {
	currentTimeline: AnyTimeline;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
	callbackSubjectKeyDown(ev: KeyboardEvent, currentTimeline: AnyTimeline): void;
	callbackWorkloadKeyDown(ev: KeyboardEvent, currentTimeline: AnyTimeline): void;
}

const AnyTimelineEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const selectingId = Timelines.toNodePreviousId(props.currentTimeline);

	const setDetailEditTimeline = useSetAtom(DetailEditTimelineAtom);
	const setHoverTimelineId = useSetAtom(HoverTimelineIdAtom);
	const setHighlightTimelineIds = useSetAtom(HighlightTimelineIdsAtom);
	const setHighlightDays = useSetAtom(HighlightDaysAtom);
	const setActiveTimelineId = useSetAtom(ActiveTimelineIdAtom);
	const setDragSourceTimeline = useSetAtom(DragSourceTimelineAtom);
	const timelineItems = useAtomValue(TimelineItemsAtom);
	const workRanges = useAtomValue(WorkRangesAtom);
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [workload, setWorkload] = useState(0);
	const [memberId, setMemberId] = useState(Settings.maybeTaskTimeline(props.currentTimeline) ? props.currentTimeline.memberId : "");
	const [workRangeKind, setWorkRangeKind] = useState(WorkRangeKind.Loading);
	const [beginDate, setBeginDate] = useState<DateTime | null>(null);
	const [endDate, setEndDate] = useState<DateTime | null>(null);
	const [progress, setProgress] = useState(0);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);
	const [selectedBeginDate, setSelectedBeginDate] = useState(props.selectingBeginDate?.beginDate ?? null);
	const [visibleBeginDateInput, setVisibleBeginDateInput] = useState(false);
	const refInputDate = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (refInputDate.current) {
			refInputDate.current.focus();
		}
	}, [refInputDate]);

	useEffect(() => {
		const timelineItem = timelineItems.get(props.currentTimeline.id);
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
	}, [props.currentTimeline, props.timelineStore, timelineItems]);

	useEffect(() => {
		const isVisibleBeginDateInput = Boolean(props.selectingBeginDate && props.selectingBeginDate.timeline.id === props.currentTimeline.id);
		setVisibleBeginDateInput(isVisibleBeginDateInput);
		if (isVisibleBeginDateInput) {
			handleFocus(false);
			setHoverTimelineId(undefined);
		}
	}, [props.currentTimeline.id, props.selectingBeginDate]); // eslint-disable-line react-hooks/exhaustive-deps

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

		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			workload: workload,
		});
	}

	function handleChangeProgress(progress: Progress) {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		//const progress = n / 100.0;

		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			progress: progress,
		});
	}

	function handleControlMoveItem(direction: MoveDirection) {
		props.timelineStore.moveTimeline(direction, props.currentTimeline);
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

	function handleShowDetail() {
		setDetailEditTimeline(props.currentTimeline);
	}

	function handleShowTimeline(): void {
		let date: DateTime | undefined = undefined;
		const workRange = workRanges.get(props.currentTimeline.id);
		if (workRange && WorkRanges.maybeSuccessWorkRange(workRange)) {
			date = workRange.begin;
		}

		setHighlightTimelineIds([props.currentTimeline.id]);
		setHighlightDays(date ? [date] : []);

		Editors.scrollView(props.currentTimeline.id, date);
	}

	function handleChangeMember(memberGroupPair: MemberGroupPair | undefined): void {
		if (!Settings.maybeTaskTimeline(props.currentTimeline)) {
			throw new Error();
		}

		props.timelineStore.updateTimeline({
			...props.currentTimeline,
			memberId: memberGroupPair?.member.id ?? "",
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
		//props.timelineStore.startDragTimeline(ev, props.currentTimeline);
		setDragSourceTimeline(props.currentTimeline);
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

		props.selectingBeginDate.beginDate = date ? DateTime.convert(date, calendarInfoAtomReader.data.timeZone) : null;
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

		if (!props.selectingBeginDate) {
			return;
		}

		props.currentTimeline.static = props.selectingBeginDate.beginDate ? props.selectingBeginDate.beginDate.format("yyyy-MM-dd") : undefined;
		props.currentTimeline.previous = [...props.selectingBeginDate.previous];

		props.beginDateCallbacks.submitSelectBeginDate(props.currentTimeline);
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
			setActiveTimelineId(props.currentTimeline.id);
		} else {
			setActiveTimelineId(undefined);
		}
	}

	const timelineIndex = props.timelineStore.calcReadableTimelineId(props.currentTimeline);

	return (
		<TimelineHeaderRow
			currentTimeline={props.currentTimeline}
			selectingBeginDate={props.selectingBeginDate}
			timelineStore={props.timelineStore}
			level={timelineIndex.level}
		>
			<IdCell
				selectingId={selectingId}
				readableTimelineId={timelineIndex}
				currentTimeline={props.currentTimeline}
				progress={progress}
				isSelectedPrevious={isSelectedPrevious}
				selectingBeginDate={props.selectingBeginDate}
				callbackStartDragTimeline={handleStartDragTimeline}
				callbackChangePrevious={handleChangePrevious}
			/>
			<SubjectCell
				timeline={props.currentTimeline}
				value={subject}
				disabled={Boolean(props.selectingBeginDate)}
				readOnly={false}
				callbackChangeValue={handleChangeSubject}
				callbackFocus={handleFocus}
				callbackKeyDown={onSubjectKeyDown}
			/>
			<WorkloadCell
				timeline={props.currentTimeline}
				readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
				disabled={Boolean(props.selectingBeginDate)}
				value={workload}
				callbackChangeValue={Settings.maybeTaskTimeline(props.currentTimeline) ? handleChangeWorkload : undefined}
				callbackFocus={handleFocus}
				callbackKeyDown={handleWorkloadKeyDown}
			/>
			<ResourceCell
				currentTimeline={props.currentTimeline}
				selectedMemberId={memberId}
				disabled={Boolean(props.selectingBeginDate)}
				callbackChangeMember={handleChangeMember}
				callbackFocus={handleFocus}
			/>
			<RelationCell
				currentTimeline={props.currentTimeline}
				selectable={Boolean(props.selectingBeginDate)}
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
										value={selectedBeginDate ? selectedBeginDate.toInput("date") : ""}
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
							selectable={Boolean(props.selectingBeginDate)}
							beginDate={beginDate}
							endDate={endDate}
							htmlFor={selectingId}
							callbackClickBeginDate={Settings.maybeTaskTimeline(props.currentTimeline) ? handleClickBeginDate : undefined}
						/>
					)
			}
			<ProgressCell
				readOnly={!Settings.maybeTaskTimeline(props.currentTimeline)}
				disabled={Boolean(props.selectingBeginDate)}
				progress={progress}
				callbackChangeValue={Settings.maybeTaskTimeline(props.currentTimeline) ? handleChangeProgress : undefined}
				callbackFocus={handleFocus}
			/>
			<ControlsCell
				currentTimelineKind={props.currentTimeline.kind}
				disabled={Boolean(props.selectingBeginDate)}
				callbackMoveItem={handleControlMoveItem}
				callbackAddItem={handleControlAddItem}
				callbackDeleteItem={handleControlDeleteItem}
				callbackShowDetail={handleShowDetail}
				callbackShowTimeline={handleShowTimeline}
			/>
		</TimelineHeaderRow >
	);
};

export default AnyTimelineEditor;
