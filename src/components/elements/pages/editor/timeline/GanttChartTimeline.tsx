import { FC, ReactNode, useLayoutEffect, useState } from "react";

import GroupChart from "@/components/elements/pages/editor/timeline/chart/GroupChart";
import TaskChart from "@/components/elements/pages/editor/timeline/chart/TaskChart";
import { Charts } from "@/models/Charts";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { SuccessWorkRange } from "@/models/data/WorkRange";
import { Settings } from "@/models/Settings";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends GanttChartTimelineProps { }

const GanttChartTimeline: FC<Props> = (props: Props) => {

	const [successWorkRange, setSuccessWorkRange] = useState<SuccessWorkRange | null>();

	useLayoutEffect(() => {
		const timelineItem = props.timelineStore.changedItemMap.get(props.currentTimeline.id);
		if (timelineItem) {
			if (timelineItem.workRange) {
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.workRange)) {
					setSuccessWorkRange(timelineItem.workRange);
				} else {
					setSuccessWorkRange(null);
				}
			}
		}
	}, [props.timelineStore, props.currentTimeline]);


	function renderCurrentTimeline(): ReactNode {
		const cell = props.configuration.design.honest.cell;

		const timeSpanRange = successWorkRange
			? Charts.getTimeSpanRange(props.calendarInfo.range.from, successWorkRange)
			: null
			;

		const area = Charts.createChartArea(timeSpanRange, props.currentIndex, cell, props.chartSize);

		return (
			Settings.maybeTaskTimeline(props.currentTimeline)
				? (
					<TaskChart
						configuration={props.configuration}
						currentTimeline={props.currentTimeline}
						background={Charts.getTaskBackground(props.currentTimeline, props.memberMap, props.setting.theme)}
						foreground={props.setting.theme.timeline.completed}
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
						background={Charts.getGroupBackground(props.currentTimeline, props.setting.rootTimeline, props.setting.theme)}
						foreground="#ffffff"
						borderColor="#000000"
						borderThickness={4}
						area={area}
						timelineStore={props.timelineStore}
					// progress={props.currentTimeline.progress}
					/>
				) : null
		);
	}

	return (
		<>
			{renderCurrentTimeline()}
		</>
	);
};

export default GanttChartTimeline;
