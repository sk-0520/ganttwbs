import { TimeSpan } from "@/models/TimeSpan";
import { WorkRanges } from "@/models/WorkRanges";
import { CalendarRange } from "@/models/data/CalendarRange";
import { ChartSize } from "@/models/data/ChartSize";
import { TaskTimeline } from "@/models/data/Setting";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStore } from "@/models/store/TimelineStore";
import { NextPage } from "next";

interface Props extends ConfigurationProps {
	chartSize: ChartSize;
	currentTimeline: TaskTimeline;
	currentIndex: number;
	timelineStore: TimelineStore;
	calendarRange: CalendarRange;
}

const Component: NextPage<Props> = (props: Props) => {
	if (!props.currentTimeline.previous.length) {
		return <></>;
	}

	return (
		<g>
			{props.currentTimeline.previous.map(a => {
				const item = props.timelineStore.changedItems.get(a);
				if(!item) {
					return null;
				}
				const timeRange = item.range;
				if(!timeRange) {
					return null;
				}
				if(!WorkRanges.maybeSuccessWorkRange(timeRange)) {
					return null;
				}

				const cell = props.configuration.design.honest.cell;

				const startDiffTime = timeRange.begin.getTime() - props.calendarRange.from.getTime();
				const startDiffSpan = TimeSpan.fromMilliseconds(startDiffTime);
				const startDiffDays = startDiffSpan.totalDays;

				const endDiffTime = timeRange.end.getTime() - timeRange.begin.getTime();
				const endDiffSpan = TimeSpan.fromMilliseconds(endDiffTime);
				const endDiffDays = endDiffSpan.totalDays;

				const x = startDiffDays * cell.width.value;
				const y = props.currentIndex * cell.height.value;
				const width = endDiffDays * cell.width.value;
				const height = cell.height.value;

				return (
					<line
						key={props.currentTimeline.id + "-" + a}
						x1={x}
						x2={x + width}
						y1={y}
						y2={y + height}
						strokeWidth={5}
						stroke="black"
					/>
				);
			})}
		</g>
	)
};

export default Component;
