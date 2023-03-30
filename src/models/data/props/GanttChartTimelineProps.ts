import { TimeRange } from "@/models/TimeRange";
import { GroupTimeline, Timeline, TimelineId } from "../Setting";
import { EditProps } from "./EditProps";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	range: {
		from: Date,
		to: Date,
	}

	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

