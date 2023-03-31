import { TimeRange } from "@/models/TimeRange";
import { GroupTimeline, MemberId, Timeline, TimelineId } from "../Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "../MemberMapValue";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	range: {
		from: Date,
		to: Date,
	};

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

