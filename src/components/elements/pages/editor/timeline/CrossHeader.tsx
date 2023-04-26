import { FC, useEffect, useState } from "react";

import { IconImage, IconKind } from "@/components/elements/Icon";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, TimelineKind } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Timelines } from "@/models/Timelines";
import { IdFactory } from "@/models/IdFactory";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {
	//nop
}

const CrossHeader: FC<Props> = (props: Props) => {

	const [visibleTimelinesImportDialog, setVisibleTimelinesImportDialog] = useState(false);

	useEffect(() => {
		const timeline = props.timelineStore.changedItemMap.get(IdFactory.rootTimelineId);
		if (timeline) {
			console.debug(timeline);
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

	function scrollFromDate(date: DateTime): void {
		const daysId = Timelines.toDaysId(date);
		const targetElement = document.getElementById(daysId);
		const mainContentElement = document.querySelector(".tab-timeline");
		if (targetElement && mainContentElement) {
			mainContentElement.scrollTo({
				left: targetElement.offsetLeft
			});
		}
	}

	function handleInputTimelines(timeline: GroupTimeline | null) {
		if (timeline) {
			props.timelineStore.addNewTimeline(props.timelineStore.rootGroupTimeline, timeline, NewTimelinePosition.Next);
		}

		setVisibleTimelinesImportDialog(false);
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
								onClick={ev => scrollFromDate(DateTime.today(props.calendarInfo.timeZone))}
							>
								<IconImage
									kind={IconKind.CalendarToday}
								/>
								けふ
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer">
				<div className='timeline-header header'>
					<div className='timeline-cell timeline-id'>ID</div>
					<div className='timeline-cell timeline-subject'>作業</div>
					<div className='timeline-cell timeline-workload'>工数</div>
					<div className='timeline-cell timeline-resource'>割当</div>
					<div className="timeline-cell timeline-relation">💩</div>
					<div className='timeline-cell timeline-range-from'>開始</div>
					<div className='timeline-cell timeline-range-to'>終了</div>
					<div className='timeline-cell timeline-progress'>進捗率</div>
					<div className='timeline-cell timeline-controls'>操作</div>
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
