import { FC, useEffect, useState } from "react";

import { IconImage, IconKind, IconLabel } from "@/components/elements/Icon";
import InformationDialog from "@/components/elements/pages/editor/timeline/InformationDialog";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import Timestamp from "@/components/elements/Timestamp";
import locale from "@/locales/ja";
import { useHighlightDaysAtomWriter, useHighlightTimelineIdsAtomWriter, useHoverTimelineIdAtomWriter } from "@/models/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useDayInfosAtomReader, useRootTimelineAtomReader, useSequenceTimelinesAtomReader, useSettingAtomReader, useTimelineItemsAtomReader, useWorkRangesAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, TimelineId, TimelineKind } from "@/models/data/Setting";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Editors } from "@/models/Editors";
import { IdFactory } from "@/models/IdFactory";
import { createLogger } from "@/models/Logging";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";

const logger = createLogger("CrossHeader");

interface Props extends ConfigurationProps, TimelineCallbacksProps {
}

const CrossHeader: FC<Props> = (props: Props) => {
	const settingAtomReader = useSettingAtomReader();
	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const highlightTimelineIdsAtomWriter = useHighlightTimelineIdsAtomWriter();
	const highlightDaysAtomWriter = useHighlightDaysAtomWriter();
	const sequenceTimelinesAtomReader = useSequenceTimelinesAtomReader();
	const rootTimelineReader = useRootTimelineAtomReader();
	const timelineItemsAtomReader = useTimelineItemsAtomReader();
	const dayInfosAtomReader = useDayInfosAtomReader();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();
	const workRangesAtomReader = useWorkRangesAtomReader();

	const [visibleTimelinesImportDialog, setVisibleTimelinesImportDialog] = useState(false);
	const [workload, setWorkload] = useState(0);
	const [workRangeKind, setWorkRangeKind] = useState(WorkRangeKind.Loading);
	const [beginDate, setBeginDate] = useState<DateTime | null>(null);
	const [endDate, setEndDate] = useState<DateTime | null>(null);
	const [progress, setProgress] = useState(0);
	const [visibleInformation, setVisibleInformation] = useState(false);

	useEffect(() => {
		const timelineItem = timelineItemsAtomReader.data.get(IdFactory.rootTimelineId);
		if (timelineItem && Settings.maybeGroupTimeline(timelineItem.timeline)) {
			logger.debug(timelineItem);

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
	}, [props.timelineCallbacks, timelineItemsAtomReader.data]);

	function addEmptyTimeline(kind: TimelineKind) {
		props.timelineCallbacks.addEmptyTimeline(
			rootTimelineReader.data,
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
			props.timelineCallbacks.addNewTimeline(rootTimelineReader.data, timeline, NewTimelinePosition.Next);
		}

		setVisibleTimelinesImportDialog(false);
	}

	function handleClickCalendarToday(): void {
		const date = DateTime.today(calendarInfoAtomReader.data.timeZone);
		scrollView(undefined, date);
	}

	function handleClickCalendarFirst(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(workRangesAtomReader.data);
		if (range.begin) {
			scrollView(range.begin.timelineId, range.begin.workRange.begin);
		}
	}

	function handleClickCalendarLast(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(workRangesAtomReader.data);
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
		const keys = [...dayInfosAtomReader.data.keys()].sort((a, b) => Number(a) - Number(b));
		if (keys.length) {
			const date = DateTime.convert(keys[0], calendarInfoAtomReader.data.timeZone).truncateTime();
			scrollView(undefined, date);
		}
	}

	function handleClickInformationLast(): void {
		const keys = [...dayInfosAtomReader.data.keys()].sort((a, b) => Number(b) - Number(a));
		if (keys.length) {
			const date = DateTime.convert(keys[0], calendarInfoAtomReader.data.timeZone).truncateTime();
			scrollView(undefined, date);
		}
	}

	function handleMouseEnter() {
		hoverTimelineIdAtomWriter.write(undefined);
	}

	function scrollView(timelineId: TimelineId | undefined, date: DateTime | undefined): void {
		highlightTimelineIdsAtomWriter.write(timelineId ? [timelineId] : []);
		highlightDaysAtomWriter.write(date ? [date] : []);
		Editors.scrollView(timelineId, date);
	}

	return (
		<div
			id="cross-header"
			onMouseEnter={handleMouseEnter}
		>
			<div className="header">
				<h1>{settingAtomReader.data.name}</h1>
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
								disabled={!dayInfosAtomReader.data.size}
								title={locale.pages.editor.timeline.header.operations.informationFirst}
							>
								<IconImage
									kind={IconKind.NavigatePrev}
								/>
							</button>
						</li>
						<li>
							<button
								disabled={!dayInfosAtomReader.data.size}
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
								disabled={!dayInfosAtomReader.data.size}
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
							{sequenceTimelinesAtomReader.data.filter(a => Settings.maybeTaskTimeline(a)).length}
							/
							{sequenceTimelinesAtomReader.data.length}
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
							<IconImage kind={IconKind.RelationHeader} />
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
						<IconImage kind={IconKind.RelationHeader} />
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
					timelineCallbacks={props.timelineCallbacks}
					callbackClose={handleCloseInformation}
				/>
			)}
		</div>
	);
};

export default CrossHeader;


