import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";

import GroupChart from "@/components/elements/pages/editor/timeline/chart/GroupChart";
import TaskChart from "@/components/elements/pages/editor/timeline/chart/TaskChart";
import { Charts } from "@/models/Charts";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { SuccessWorkRange } from "@/models/data/WorkRange";
import { Settings } from "@/models/Settings";
import { WorkRanges } from "@/models/WorkRanges";


interface Props extends GanttChartTimelineProps { }

const Component: NextPage<Props> = (props: Props) => {

	const [successWorkRange, setSuccessWorkRange] = useState<SuccessWorkRange | null>();

	useEffect(() => {
		const timelineItem = props.timelineStore.changedItems.get(props.currentTimeline.id);
		if (timelineItem) {
			if (timelineItem.range) {
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.range)) {
					setSuccessWorkRange(timelineItem.range);
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
		);
	}

	return (
		<>
			{renderCurrentTimeline()}
		</>
	);
};

export default Component;
