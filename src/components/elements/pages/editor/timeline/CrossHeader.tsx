import { FC, useEffect, useState } from "react";

import { IconImage, IconKind, IconLabel } from "@/components/elements/Icon";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import Timestamp from "@/components/elements/Timestamp";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, TimelineKind } from "@/models/data/Setting";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { IdFactory } from "@/models/IdFactory";
import { Settings } from "@/models/Settings";
import { TimelineIdOrObject, Timelines } from "@/models/Timelines";
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

	function scrollView(timeline: TimelineIdOrObject | undefined, date: DateTime | undefined): void {
		const mainContentElement = document.querySelector(".tab-timeline");
		if (!mainContentElement) {
			return;
		}

		const columnElement = date ? document.getElementById(Timelines.toDaysId(date)) : undefined;
		const rowElement = timeline ? document.getElementById(Timelines.toRowId(timeline)) : undefined;

		mainContentElement.scrollTo({
			left: columnElement?.offsetLeft,
			top: rowElement?.offsetTop,
		});
	}

	function handleInputTimelines(timeline: GroupTimeline | null) {
		if (timeline) {
			props.timelineStore.addNewTimeline(props.timelineStore.rootGroupTimeline, timeline, NewTimelinePosition.Next);
		}

		setVisibleTimelinesImportDialog(false);
	}

	function handleClickNavigateToday(): void {
		scrollView(undefined, DateTime.today(props.calendarInfo.timeZone));
	}

	function handleClickNavigatePrev(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(props.timelineStore.workRanges);
		if (range.begin) {
			scrollView(range.begin.timelineId, range.begin.workRange.begin);
		}
	}

	function handleClickNavigateNext(): void {
		const range = WorkRanges.getSuccessTimelineIdRange(props.timelineStore.workRanges);
		if (range.end) {
			scrollView(range.end.timelineId, range.end.workRange.begin);
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
								<IconImage
									kind={IconKind.TimelineAddGroup}
								/>
								add new group
							</button>
						</li>
						<li>
							<button
								type='button'
								onClick={handleAddEmptyTask}
							>
								<IconImage
									kind={IconKind.TimelineAddTask}
								/>
								add new task
							</button>
						</li>
						<li>
							<button
								type='button'
								onClick={handleShowInputTimeline}
							>
								<IconImage
									kind={IconKind.TimelineImport}
								/>
								add timelines
							</button>
						</li>
						<li>
							<button
								onClick={ev => handleClickNavigatePrev()}
							>
								<IconImage
									kind={IconKind.NavigatePrev}
									title="最初"
								/>
							</button>
						</li>
						<li>
							<button
								onClick={ev => handleClickNavigateToday()}
							>
								<IconLabel
									kind={IconKind.CalendarToday}
									label="けふ"
								/>
							</button>
						</li>
						<li>
							<button
								onClick={ev => handleClickNavigateNext()}
							>
								<IconImage
									kind={IconKind.NavigateNext}
									title="最後"
								/>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer">
				<div className='timeline-header header'>
					<div className='timeline-header tooltips'>
						<div className='timeline-cell timeline-id' />
						<div className='timeline-cell timeline-subject' />
						<div className='timeline-cell timeline-workload'>
							{workload}
						</div>
						<div className='timeline-cell timeline-resource' />
						<div className="timeline-cell timeline-relation" />
						{
							workRangeKind === WorkRangeKind.Success
								? (
									<>
										<div className='timeline-cell timeline-range-from'>
											<Timestamp
												date={beginDate}
												format="date"
											/>
										</div>
										<div className='timeline-cell timeline-range-to'>
											<Timestamp
												date={endDate}
												format="date"
											/>
										</div>
									</>
								) :
								(
									<div className='timeline-cell timeline-range-area'>
										あかん
									</div>
								)
						}
						<div className='timeline-cell timeline-progress'>
							{Timelines.displayProgress(progress)}%
						</div>
						<div className='timeline-cell timeline-controls' />
					</div>

					<div className='timeline-cell timeline-id'>
						ID
					</div>
					<div className='timeline-cell timeline-subject'>
						作業
					</div>
					<div className='timeline-cell timeline-workload'>
						工数
					</div>
					<div className='timeline-cell timeline-resource'>
						割当
					</div>
					<div className="timeline-cell timeline-relation">
						💩
					</div>
					<div className='timeline-cell timeline-range-from'>
						開始
					</div>
					<div className='timeline-cell timeline-range-to'>
						終了
					</div>
					<div className='timeline-cell timeline-progress'>
						進捗率
					</div>
					<div className='timeline-cell timeline-controls'>
						操作
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


