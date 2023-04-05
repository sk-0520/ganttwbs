import { GroupTimeline, MemberId, Timeline, TimelineId } from "../Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "../MemberMapValue";
import { ChartSize } from "../ChartSize";
import { DateTimeRange } from "../DateTimeRange";
import { TimelineStore } from "@/models/store/TimelineStore";

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

	updateRelations: () => void;

	timelineStore: TimelineStore;
}

