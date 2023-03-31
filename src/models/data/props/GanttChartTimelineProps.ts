import { TimeRange } from "@/models/TimeRange";
import { Color, Group, GroupTimeline, Member, MemberId, Timeline, TimelineId } from "../Setting";
import { EditProps } from "./EditProps";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	range: {
		from: Date,
		to: Date,
	};

	memberMap: ReadonlyMap<MemberId, {
		group: Group,
		member: Member
	}>;

	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

