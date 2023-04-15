import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { GroupTimeline, MemberId, TaskTimeline, Theme } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import TaskChart from "./chart/TaskChart";
import { ChartArea } from "@/models/data/ChartArea";
import GroupChart from "./chart/GroupChart";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";
import { SuccessWorkRange } from "@/models/data/WorkRange";
import { Charts } from "@/models/Charts";

interface Props extends GanttChartTimelineProps { }

const Component: NextPage<Props> = (props: Props) => {

	const [timeRange, setTimeRange] = useState<SuccessWorkRange | null>();

	useEffect(() => {
		const timelineItem = props.timelineStore.changedItems.get(props.currentTimeline.id);
		if (timelineItem) {
			if (timelineItem.range) {
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.range)) {
					setTimeRange(timelineItem.range);
				} else {
					setTimeRange(null);
				}
			}
		}
	}, [props.timelineStore, props.currentTimeline]);


	function renderCurrentTimeline(): ReactNode {
		if (!timeRange) {
			return <></>
		}

		const cell = props.configuration.design.honest.cell;

		// const startDiffTime = timeRange.begin.getTime() - props.calendarRange.from.getTime();
		// const startDiffSpan = TimeSpan.fromMilliseconds(startDiffTime);
		// const startDiffDays = startDiffSpan.totalDays;

		// const endDiffTime = timeRange.end.getTime() - timeRange.begin.getTime();
		// const endDiffSpan = TimeSpan.fromMilliseconds(endDiffTime);
		// const endDiffDays = endDiffSpan.totalDays;

		const timeSpanRange = Charts.getTimeSpanRange(props.calendarRange.from, timeRange);

		/*
		const x = timeRange.start.totalDays * cell.width.value;
		const y = props.currentIndex * cell.height.value;
		const width = timeRange.end.totalDays * cell.width.value;
		const height = cell.height.value;

		const area: ChartArea = {
			x: x,
			y: y,
			width: width,
			height: height,
			chartSize: props.chartSize
		};
		*/

		const area = Charts.createChartArea(timeSpanRange, props.currentIndex, cell, props.chartSize);

		//console.debug(props.currentTimeline.id, startDiffDays);

		return (
			<>
				{
					Settings.maybeTaskTimeline(props.currentTimeline)
						? (
							<TaskChart
								configuration={props.configuration}
								currentTimeline={props.currentTimeline}
								background={getTaskBackground(props.currentTimeline, props.memberMap, props.editData.setting.theme)}
								foreground={props.editData.setting.theme.timeline.completed}
								borderColor="#000000"
								borderThickness={1}
								area={area}
								timelineStore={props.timelineStore}
								progress={props.currentTimeline.progress}
							/>
						) : Settings.maybeGroupTimeline(props.currentTimeline) ? (
							<GroupChart
								configuration={props.configuration}
								currentTimeline={props.currentTimeline}
								background={getGroupBackground(props.currentTimeline, props.editData.setting.timelineNodes, props.editData.setting.theme)}
								foreground="#ffffff"
								borderColor="#000000"
								borderThickness={4}
								area={area}
								timelineStore={props.timelineStore}
							// progress={props.currentTimeline.progress}
							/>
						) : null
				}
				<>
					{/* <text
						x={area.x + area.width}
						y={area.y + area.height}
					>
						{props.currentTimeline.id}/{props.currentIndex}
					</text> */}

					{/* <text y={y + (cell.height.value / 2)}>{props.currentTimeline.id}@{x}:{y}</text> */}
				</>
			</>
		)
	}

	return (
		<>
			{renderCurrentTimeline()}
		</>
	);
};

export default Component;


function getGroupBackground(timeline: GroupTimeline, nodes: ReadonlyArray<GroupTimeline | TaskTimeline>, theme: Theme): string {
	// 未設定とグループラインの扱いが微妙過ぎる
	const parents = Timelines.getParentGroup(timeline, nodes);
	if (parents) {
		if (parents.length < theme.groups.length) {
			// これはこれで正しいのだ(-1 したい気持ちは抑えるべし)
			const index = parents.length;
			if (index in theme.groups) {
				return theme.groups[index];
			}
			return theme.timeline.defaultGroup;
		}
	}

	return theme.timeline.group;
}

function getTaskBackground(timeline: TaskTimeline, memberMap: ReadonlyMap<MemberId, MemberMapValue>, theme: Theme): string {
	const member = memberMap.get(timeline.memberId);
	if (member) {
		return member.member.color;
	}

	return theme.timeline.defaultTask;
}

