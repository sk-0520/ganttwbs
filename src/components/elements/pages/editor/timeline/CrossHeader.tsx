import { NextPage } from "next";
import { useState } from "react";

import Icon from "@/components/elements/Icon";
import InputTimelinesDialog from "@/components/elements/pages/editor/timeline/InputTimelinesDialog";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { EditProps } from "@/models/data/props/EditProps";
import { GroupTimeline, TimelineKind } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { IconKind } from "@/models/IconKind";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";

interface Props extends EditProps {
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {

	const [visibleInputTimelinesDialog, setVisibleInputTimelinesDialog] = useState(false);

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
		setVisibleInputTimelinesDialog(true);
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

		setVisibleInputTimelinesDialog(false);
	}

	return (
		<div id='cross-header'>
			<div className="header">
				<h1>{props.editData.setting.name}</h1>
			</div>
			<div className="content">
				<div className='operation'>
					<ul className="inline">
						<li>
							<button
								type='button'
								onClick={handleAddEmptyGroup}
							>
								<Icon
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
								<Icon
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
								<Icon
									kind={IconKind.TimelineImport}
								/>
								add timelines
							</button>
						</li>
						<li>
							<button
								onClick={ev => scrollFromDate(DateTime.today(props.calendarInfo.timeZone))}
							>
								<Icon
									kind={IconKind.CalendarToday}
								/>
								けふ
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer">
				<div className='timeline-header'>
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
			{visibleInputTimelinesDialog && (
				<InputTimelinesDialog
					callbackClose={handleInputTimelines}
				/>
			)}
		</div>
	);
};

export default Component;
