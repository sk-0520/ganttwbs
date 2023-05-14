import { useSetAtom } from "jotai";
import { FC, useEffect, useState } from "react";

import { IconImage, IconKind, IconLabel } from "@/components/elements/Icon";
import InformationDialog from "@/components/elements/pages/editor/timeline/InformationDialog";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import Timestamp from "@/components/elements/Timestamp";
import locale from "@/locales/ja";
import { HighlightDaysAtom, HighlightTimelineIdsAtom, HoverTimelineIdAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, TimelineId, TimelineKind } from "@/models/data/Setting";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Editors } from "@/models/Editors";
import { IdFactory } from "@/models/IdFactory";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {
	//nop
}

const CrossHeader: FC<Props> = (props: Props) => {
	const setHoverTimelineId = useSetAtom(HoverTimelineIdAtom);
	const setHighlightTimelineIds = useSetAtom(HighlightTimelineIdsAtom);
	const setHighlightDays = useSetAtom(HighlightDaysAtom);

	const [visibleTimelinesImportDialog, setVisibleTimelinesImportDialog] = useState(false);
	const [workload, setWorkload] = useState(0);
	const [workRangeKind, setWorkRangeKind] = useState(WorkRangeKind.Loading);
	const [beginDate, setBeginDate] = useState<DateTime | null>(null);
	const [endDate, setEndDate] = useState<DateTime | null>(null);
	const [progress, setProgress] = useState(0);
	const [visibleInformation, setVisibleInformation] = useState(false);

	useEffect(() => {
		const timelineItem = props.timelineStore.changedItemMap.get(IdFactory.rootTimelineId);
		if (timelineItem && Settings.maybeGroupTimeline(timelineItem.timeline)) {
			console.debug(timelineItem);

			const workload = Timelines.sumWorkloadByGroup(timelineItem.timeline).totalDays;
			setWorkload(workload);

			const progress = Timelines.sumProgressByGroup(timelineItem.timeline);
			setProgress(progress);

			if (timelineItem.workRange) {
				setWorkRangeKind(timelineItem.workRange.kind);
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.workRange)) {
					setBeginDate(timelineItem.workRange.begin);
					setEndDate(timelineItem.workRange.end);
				}
			}

		}
	}, [props.timelineStore]);

	function addEmptyTimeline(kind: TimelineKind) {
		props.timelineStore.addEmptyTimeline(
			props.timelineStore.rootGroupTimeline,
			{
				position: NewTimelinePosition.Next,
				timelineKind: kind,
			}
		);
	}

	function handleAddEmptyGroup() {
		addEmptyTimeline("group");
	}

	function handleAddEmptyTask() {
		addEmptyTimeline("task");
	}

	function handleShowInputTimeline() {
		setVisibleTimelinesImportDialog(true);
	}

	function handleInputTimelines(timeline: GroupTimeline | null) {
		if (timeline) {
			props.timelineStore.addNewTimeline(props.timelineStore.rootGroupTimeline, timeline, NewTimelinePosition.Next);
		}

		setVisibleTimelinesImportDialog(false);
	}

	function handleClickCalendarToday(): void {
		const date = DateTime.today(props.calendarInfo.timeZone);
		scrollView(undefined, date);
	}

	function handleClickCalendarFirst(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(props.timelineStore.workRanges);
		if (range.begin) {
			scrollView(range.begin.timelineId, range.begin.workRange.begin);
		}
	}

	function handleClickCalendarLast(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(props.timelineStore.workRanges);
		if (range.end) {
			scrollView(range.end.timelineId, range.end.workRange.begin);
		}
	}

	function handleClickInformationList(): void {
		setVisibleInformation(true);
	}

	function handleCloseInformation(date: DateTime | undefined): void {
		setVisibleInformation(false);
		if (date) {
			scrollView(undefined, date);
		}
	}

	function handleClickInformationFirst(): void {
		const keys = [...props.timelineStore.dayInfos.keys()].sort((a, b) => a - b);
		if (keys.length) {
			const date = DateTime.convert(keys[0], props.calendarInfo.timeZone).toDateOnly();
			scrollView(undefined, date);
		}
	}

	function handleClickInformationLast(): void {
		const keys = [...props.timelineStore.dayInfos.keys()].sort((a, b) => b - a);
		if (keys.length) {
			const date = DateTime.convert(keys[0], props.calendarInfo.timeZone).toDateOnly();
			scrollView(undefined, date);
		}
	}

	function handleMouseEnter() {
		setHoverTimelineId(undefined);
	}

	function scrollView(timelineId: TimelineId | undefined, date: DateTime | undefined): void {
		setHighlightTimelineIds(timelineId ? [timelineId] : []);
		setHighlightDays(date ? [date] : []);
		Editors.scrollView(timelineId, date);
	}

	return (
		<div
			id="cross-header"
			onMouseEnter={handleMouseEnter}
		>
			<div className="header">
				<h1>{props.setting.name}</h1>
			</div>
			<div className="content">
				<div className="operation">
					<ul className="inline">
						<li>
							<button
								type="button"
								onClick={handleAddEmptyGroup}
							>
								<IconLabel
									kind={IconKind.TimelineAddGroup}
									label={locale.pages.editor.timeline.header.operations.addNewGroupTimeline}
								/>
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={handleAddEmptyTask}
							>
								<IconLabel
									kind={IconKind.TimelineAddTask}
									label={locale.pages.editor.timeline.header.operations.addNewTaskTimeline}
								/>
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={handleShowInputTimeline}
							>
								<IconLabel
									kind={IconKind.TimelineImport}
									label={locale.pages.editor.timeline.header.operations.importTimelines}
								/>
							</button>
						</li>
						<li>
							<hr />
						</li>
						<li>
							<button
								onClick={ev => handleClickCalendarFirst()}
								title={locale.pages.editor.timeline.header.operations.calendarFirst}
							>
								<IconImage
									kind={IconKind.NavigatePrev}
								/>
							</button>
						</li>
						<li>
							<button
								onClick={ev => handleClickCalendarToday()}
							>
								<IconLabel
									kind={IconKind.CalendarToday}
									label={locale.pages.editor.timeline.header.operations.calendarToday}
								/>
							</button>
						</li>
						<li>
							<button
								title={locale.pages.editor.timeline.header.operations.calendarLast}
								onClick={ev => handleClickCalendarLast()}
							>
								<IconImage
									kind={IconKind.NavigateNext}
								/>
							</button>
						</li>
						<li>
							<hr />
						</li>
						<li>
							<button
								onClick={ev => handleClickInformationFirst()}
								disabled={!props.timelineStore.dayInfos.size}
								title={locale.pages.editor.timeline.header.operations.informationFirst}
							>
								<IconImage
									kind={IconKind.NavigatePrev}
								/>
							</button>
						</li>
						<li>
							<button
								disabled={!props.timelineStore.dayInfos.size}
								onClick={ev => handleClickInformationList()}
							>
								<IconLabel
									kind={IconKind.CalendarToday}
									label={locale.pages.editor.timeline.header.operations.informationList}
								/>
							</button>
						</li>
						<li>
							<button
								title={locale.pages.editor.timeline.header.operations.informationLast}
								disabled={!props.timelineStore.dayInfos.size}
								onClick={ev => handleClickInformationLast()}
							>
								<IconImage
									kind={IconKind.NavigateNext}
								/>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer">
				<div className="timeline-header header">
					<div className="timeline-header specials">
						<div className="timeline-cell timeline-id"
							title={`${locale.common.timeline.task}/${locale.common.timeline.total}`}
						>
							{props.timelineStore.sequenceItems.filter(a => Settings.maybeTaskTimeline(a)).length}
							/
							{props.timelineStore.sequenceItems.length}
						</div>
						<div className="timeline-cell timeline-subject">
							{locale.pages.editor.timeline.header.columns.subject}
						</div>
						<div
							className="timeline-cell timeline-workload"
							title={locale.pages.editor.timeline.header.columns.workload}
						>
							{workload}
						</div>
						<div className="timeline-cell timeline-resource">
							{locale.pages.editor.timeline.header.columns.resource}
						</div>
						<div className="timeline-cell timeline-relation">
							{locale.pages.editor.timeline.header.columns.relation}
						</div>
						{
							workRangeKind === WorkRangeKind.Success
								? (
									<>
										<div
											className="timeline-cell timeline-range-from"
											title={locale.pages.editor.timeline.header.columns.workRangeBegin}
										>
											<Timestamp
												date={beginDate}
												format="date"
											/>
										</div>
										<div
											className="timeline-cell timeline-range-to"
											title={locale.pages.editor.timeline.header.columns.workRangeEnd}
										>
											<Timestamp
												date={endDate}
												format="date"
											/>
										</div>
									</>
								) :
								(
									<div className="timeline-cell timeline-range-area">
										{locale.pages.editor.timeline.header.columns.workRangeError}
									</div>
								)
						}
						<div
							className="timeline-cell timeline-progress"
							title={locale.pages.editor.timeline.header.columns.progress}
						>
							{Timelines.displayProgress(progress)}%
						</div>
						<div className="timeline-cell timeline-controls">
							{locale.pages.editor.timeline.header.columns.controls}
						</div>
					</div>

					<div className="timeline-cell timeline-id">
						{locale.pages.editor.timeline.header.columns.id}
					</div>
					<div className="timeline-cell timeline-subject">
						{locale.pages.editor.timeline.header.columns.subject}
					</div>
					<div className="timeline-cell timeline-workload">
						{locale.pages.editor.timeline.header.columns.workload}
					</div>
					<div className="timeline-cell timeline-resource">
						{locale.pages.editor.timeline.header.columns.resource}
					</div>
					<div className="timeline-cell timeline-relation">
						{locale.pages.editor.timeline.header.columns.relation}
					</div>
					<div className="timeline-cell timeline-range-from">
						{locale.pages.editor.timeline.header.columns.workRangeBegin}
					</div>
					<div className="timeline-cell timeline-range-to">
						{locale.pages.editor.timeline.header.columns.workRangeEnd}
					</div>
					<div className="timeline-cell timeline-progress">
						{locale.pages.editor.timeline.header.columns.progress}
					</div>
					<div className="timeline-cell timeline-controls">
						{locale.pages.editor.timeline.header.columns.controls}
					</div>
				</div>
			</div>
			{visibleTimelinesImportDialog && (
				<TimelinesImportDialog
					callbackClose={handleInputTimelines}
				/>
			)}
			{visibleInformation && (
				<InformationDialog
					configuration={props.configuration}
					calendarInfo={props.calendarInfo}
					timelineStore={props.timelineStore}
					callbackClose={handleCloseInformation}
				/>
			)}
		</div>
	);
};

export default CrossHeader;


