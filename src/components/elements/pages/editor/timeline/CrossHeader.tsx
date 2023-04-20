import { NextPage } from "next";

import { CalendarInfo } from "@/models/data/CalendarInfo";
import { EditProps } from "@/models/data/props/EditProps";
import { GroupTimeline, TimelineKind } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";
import { useState } from "react";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import InputTimelinesDialog from "@/components/elements/pages/editor/timeline/InputTimelinesDialog";

interface Props extends EditProps {
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {

	const [visibleInputDialog, setVisibleInputDialog] = useState(false);

	function addNewTimeline(kind: TimelineKind) {
		props.timelineStore.addEmptyTimeline(
			props.timelineStore.nodeItems.length ? props.timelineStore.nodeItems[props.timelineStore.nodeItems.length - 1] : null,
			{
				position: NewTimelinePosition.Next,
				timelineKind: kind,
			}
		);
	}

	function handleAddNewGroup() {
		addNewTimeline("group");
	}

	function handleAddNewTask() {
		addNewTimeline("task");
	}

	function handleShowNewTimeline() {
		setVisibleInputDialog(true);
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

	function handleInput(timeline: GroupTimeline | null) {
		if (timeline) {
			props.timelineStore.addNewTimeline(null, timeline, NewTimelinePosition.Next);
		}

		setVisibleInputDialog(false);
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
							<button type='button' onClick={handleShowNewTimeline}>add timelines</button>
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
			{visibleInputDialog && (
				<InputTimelinesDialog
					callback={handleInput}
				/>
			)}
		</div>
	);
};

export default Component;
