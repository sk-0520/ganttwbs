import { FC, ReactNode, useEffect, useState } from "react";

import GroupChart from "@/components/elements/pages/editor/timeline/shape/GroupChart";
import TaskChart from "@/components/elements/pages/editor/timeline/shape/TaskChart";
import { Charts } from "@/models/Charts";
import { useCalendarInfoAtomReader, useResourceInfoAtomReader, useTimelineItemsAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { SuccessWorkRange } from "@/models/data/WorkRange";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends GanttChartTimelineProps { }

const GanttChartTimeline: FC<Props> = (props: Props) => {
	const timelineItemsAtomReader = useTimelineItemsAtomReader();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();
	const resourceInfoAtomReader = useResourceInfoAtomReader();

	const [successWorkRange, setSuccessWorkRange] = useState<SuccessWorkRange | null>();

	useEffect(() => {
		const timelineItem = timelineItemsAtomReader.data.get(props.currentTimeline.id);
		if (timelineItem) {
			if (timelineItem.workRange) {
				if (WorkRanges.maybeSuccessWorkRange(timelineItem.workRange)) {
					setSuccessWorkRange(timelineItem.workRange);
				} else {
					setSuccessWorkRange(null);
				}
			}
		}
	}, [props.timelineStore, props.currentTimeline, timelineItemsAtomReader.data]);


	function renderCurrentTimeline(): ReactNode {
		const cell = props.configuration.design.seed.cell;

		const timeSpanRange = successWorkRange
			? Charts.getTimeSpanRange(calendarInfoAtomReader.data.range.begin, successWorkRange)
			: null
			;

		const area = Charts.createChartArea(timeSpanRange, props.currentIndex, cell, props.areaSize);

		return (
			Settings.maybeTaskTimeline(props.currentTimeline)
				? (
					<TaskChart
						configuration={props.configuration}
						currentTimeline={props.currentTimeline}
						background={Charts.getTaskBackground(props.currentTimeline, resourceInfoAtomReader.data.memberMap, props.setting.theme)}
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
						foreground={props.setting.theme.timeline.completed}
						borderColor="#000000"
						borderThickness={2}
						area={area}
						timelineStore={props.timelineStore}
					  progress={Timelines.sumProgressByGroup(props.currentTimeline)}
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
