import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { Settings } from "@/models/Settings";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import TaskChart from "./chart/TaskChart";
import GroupChart from "./chart/GroupChart";
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

		const timeSpanRange = Charts.getTimeSpanRange(props.calendarInfo.range.from, timeRange);

		const area = Charts.createChartArea(timeSpanRange, props.currentIndex, cell, props.chartSize);

		return (
			<>
				{
					Settings.maybeTaskTimeline(props.currentTimeline)
						? (
							<TaskChart
								configuration={props.configuration}
								currentTimeline={props.currentTimeline}
								background={Charts.getTaskBackground(props.currentTimeline, props.memberMap, props.editData.setting.theme)}
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
								background={Charts.getGroupBackground(props.currentTimeline, props.editData.setting.timelineNodes, props.editData.setting.theme)}
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
