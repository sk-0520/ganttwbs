import { FC, useEffect, useState } from "react";

import { IconKind, IconLabel } from "@/components/elements/Icon";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import Timestamp from "@/components/elements/Timestamp";
import locale from "@/locales/ja";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, TimelineKind } from "@/models/data/Setting";
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

	const [visibleTimelinesImportDialog, setVisibleTimelinesImportDialog] = useState(false);
	const [workload, setWorkload] = useState(0);
	const [workRangeKind, setWorkRangeKind] = useState(WorkRangeKind.Loading);
	const [beginDate, setBeginDate] = useState<DateTime | null>(null);
	const [endDate, setEndDate] = useState<DateTime | null>(null);
	const [progress, setProgress] = useState(0);

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

	function handleClickNavigateToday(): void {
		Editors.scrollView(undefined, DateTime.today(props.calendarInfo.timeZone));
	}

	function handleClickNavigatePrev(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(props.timelineStore.workRanges);
		if (range.begin) {
			Editors.scrollView(range.begin.timelineId, range.begin.workRange.begin);
		}
	}

	function handleClickNavigateNext(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(props.timelineStore.workRanges);
		if (range.end) {
			Editors.scrollView(range.end.timelineId, range.end.workRange.begin);
		}
	}

	return (
		<div id='cross-header'>
			<div className="header">
				<h1>{props.setting.name}</h1>
			</div>
			<div className="content">
				<div className='operation'>
					<ul className="inline">
						<li>
							<button
								type='button'
								onClick={handleAddEmptyGroup}
							>
								<IconLabel
									kind={IconKind.TimelineAddGroup}
									label={locale.editor.timeline.header.operations.addNewGroupTimeline}
								/>
							</button>
						</li>
						<li>
							<button
								type='button'
								onClick={handleAddEmptyTask}
							>
								<IconLabel
									kind={IconKind.TimelineAddTask}
									label={locale.editor.timeline.header.operations.addNewTaskTimeline}
								/>
							</button>
						</li>
						<li>
							<button
								type='button'
								onClick={handleShowInputTimeline}
							>
								<IconLabel
									kind={IconKind.TimelineImport}
									label={locale.editor.timeline.header.operations.importTimelines}
								/>
							</button>
						</li>
						<li>
							<hr />
						</li>
						<li>
							<button
								onClick={ev => handleClickNavigatePrev()}
							>
								<IconLabel
									kind={IconKind.NavigatePrev}
									label={locale.editor.timeline.header.operations.navigateFirst}
								/>
							</button>
						</li>
						<li>
							<button
								onClick={ev => handleClickNavigateToday()}
							>
								<IconLabel
									kind={IconKind.CalendarToday}
									label={locale.editor.timeline.header.operations.navigateToday}
								/>
							</button>
						</li>
						<li>
							<button
								onClick={ev => handleClickNavigateNext()}
							>
								<IconLabel
									kind={IconKind.NavigateNext}
									direction="right"
									label={locale.editor.timeline.header.operations.navigateLast}
								/>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer">
				<div className='timeline-header header'>
					<div className='timeline-header tooltips'>
						<div className='timeline-cell timeline-id'>
							{locale.editor.timeline.header.columns.id}
						</div>
						<div className='timeline-cell timeline-subject'>
							{locale.editor.timeline.header.columns.subject}
						</div>
						<div
							className='timeline-cell timeline-workload'
							title={locale.editor.timeline.header.columns.workload}
						>
							{workload}
						</div>
						<div className='timeline-cell timeline-resource'>
							{locale.editor.timeline.header.columns.resource}
						</div>
						<div className="timeline-cell timeline-relation">
							{locale.editor.timeline.header.columns.relation}
						</div>
						{
							workRangeKind === WorkRangeKind.Success
								? (
									<>
										<div
											className='timeline-cell timeline-range-from'
											title={locale.editor.timeline.header.columns.workRangeFrom}
										>
											<Timestamp
												date={beginDate}
												format="date"
											/>
										</div>
										<div
											className='timeline-cell timeline-range-to'
											title={locale.editor.timeline.header.columns.workRangeTo}
										>
											<Timestamp
												date={endDate}
												format="date"
											/>
										</div>
									</>
								) :
								(
									<div className='timeline-cell timeline-range-area'>
										{locale.editor.timeline.header.columns.workRangeError}
									</div>
								)
						}
						<div
							className='timeline-cell timeline-progress'
							title={locale.editor.timeline.header.columns.progress}
						>
							{Timelines.displayProgress(progress)}%
						</div>
						<div className='timeline-cell timeline-controls'>
							{locale.editor.timeline.header.columns.controls}
						</div>
					</div>

					<div className='timeline-cell timeline-id'>
						{locale.editor.timeline.header.columns.id}
					</div>
					<div className='timeline-cell timeline-subject'>
						{locale.editor.timeline.header.columns.subject}
					</div>
					<div className='timeline-cell timeline-workload'>
						{locale.editor.timeline.header.columns.workload}
					</div>
					<div className='timeline-cell timeline-resource'>
						{locale.editor.timeline.header.columns.resource}
					</div>
					<div className="timeline-cell timeline-relation">
						{locale.editor.timeline.header.columns.relation}
					</div>
					<div className='timeline-cell timeline-range-from'>
						{locale.editor.timeline.header.columns.workRangeFrom}
					</div>
					<div className='timeline-cell timeline-range-to'>
						{locale.editor.timeline.header.columns.workRangeTo}
					</div>
					<div className='timeline-cell timeline-progress'>
						{locale.editor.timeline.header.columns.progress}
					</div>
					<div className='timeline-cell timeline-controls'>
						{locale.editor.timeline.header.columns.controls}
					</div>
				</div>
			</div>
			{visibleTimelinesImportDialog && (
				<TimelinesImportDialog
					callbackClose={handleInputTimelines}
				/>
			)}
		</div>
	);
};

export default CrossHeader;


