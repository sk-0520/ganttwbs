import { GroupTimeline, MemberId, Timeline } from "../Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "../MemberMapValue";
import { ChartSize } from "../ChartSize";
import { TimelineStore } from "@/models/store/TimelineStore";
import { CalendarRange } from "../CalendarRange";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	calendarRange: CalendarRange;
	chartSize: ChartSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	updateRelations: () => void;

	timelineStore: TimelineStore;
}

