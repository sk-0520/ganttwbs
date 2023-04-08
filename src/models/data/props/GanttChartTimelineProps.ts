import { GroupTimeline, MemberId, Timeline } from "../Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "../MemberMapValue";
import { ChartSize } from "../ChartSize";
import { TimelineStore } from "@/models/store/TimelineStore";
import { DateTime } from "@/models/DateTime";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	range: {
		from: DateTime,
		to: DateTime,
	};
	chartSize: ChartSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	updateRelations: () => void;

	timelineStore: TimelineStore;
}

