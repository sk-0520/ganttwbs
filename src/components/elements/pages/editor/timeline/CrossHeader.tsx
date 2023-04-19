import { NextPage } from "next";

import { CalendarInfo } from "@/models/data/CalendarInfo";
import { EditProps } from "@/models/data/props/EditProps";
import { TimelineKind } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";
import { useState } from "react";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";

interface Props extends EditProps {
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {

	const [visibleAddTimelines, setVisibleAddTimelines] = useState(false);

	function addTimeline(kind: TimelineKind) {
		props.timelineStore.addEmptyTimeline(
			props.timelineStore.nodeItems.length ? props.timelineStore.nodeItems[props.timelineStore.nodeItems.length - 1]: null,
			{
				position: NewTimelinePosition.Next,
				timelineKind: kind,
			}
		);
	}

	function handleAddNewGroup() {
		addTimeline("group");
	}

	function handleAddNewTask() {
		addTimeline("task");
	}

	function handleAddTimelines() {
		setVisibleAddTimelines(true);
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

	return (
		<div id='cross-header'>
			<div className="header">
				<h1>{props.editData.setting.name}</h1>
			</div>
			<div className="content">
				<div className='operation'>
					<ul className="inline">
						<li>
							<button type='button' onClick={handleAddNewGroup}>add new group</button>
						</li>
						<li>
							<button type='button' onClick={handleAddNewTask}>add new task</button>
						</li>
						<li>
							<button type='button' onClick={handleAddTimelines}>add timelines</button>
						</li>
						<li>
							<button onClick={ev => scrollFromDate(DateTime.today(props.calendarInfo.timeZone))}>
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
		</div>
	);
};

export default Component;
