import { GroupTimeline, MemberId, Timeline, TimelineId } from "../Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "../MemberMapValue";
import { ChartSize } from "../ChartSize";
import { DateTimeRange } from "../DateTimeRange";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	range: {
		from: Date,
		to: Date,
	};
	chartSize: ChartSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	timeRanges: Map<TimelineId, DateTimeRange>;
	updateRelations: () => void;
}

