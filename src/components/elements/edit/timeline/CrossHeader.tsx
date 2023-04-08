import { NextPage } from "next";

import { EditProps } from "@/models/data/props/EditProps";
import { TimelineKind } from "@/models/data/Setting";
import { TimelineRootProps } from "@/models/data/props/TimelineRootProps";
import { Timelines } from "@/models/Timelines";
import { TimeZone } from "@/models/TimeZone";
import { DateTime } from "@/models/DateTime";

interface Props extends EditProps, TimelineRootProps {
	timeZone: TimeZone;
}

const Component: NextPage<Props> = (props: Props) => {

	function addTimeline(kind: TimelineKind) {
		const item = kind === "group" ? Timelines.createNewGroup() : Timelines.createNewTask();

		props.setTimelineRootNodes([
			...props.timelineRootNodes,
			item,
		]);
	}

	function handleAddNewGroup() {
		addTimeline("group");
	}

	function handleAddNewTask() {
		addTimeline("task");
	}

	function scrollFromDate(date: DateTime): void {
		const daysId = Timelines.toDaysId(date);
		const targetElement = document.getElementById(daysId);
		const mainContentElement = document.querySelector(".tab-timeline");
		if (targetElement && mainContentElement) {
			mainContentElement.scrollTo({
				left: targetElement.offsetLeft
			})
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
							<button onClick={ev => scrollFromDate(DateTime.createToday(props.timeZone))}>
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
