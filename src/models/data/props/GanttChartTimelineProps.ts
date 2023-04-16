import { GroupTimeline, MemberId, Timeline } from "../Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "../MemberMapValue";
import { ChartSize } from "../ChartSize";
import { TimelineStore } from "@/models/store/TimelineStore";
import { CalendarRange } from "../CalendarRange";
import { CalendarInfo } from "../CalendarInfo";

export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: Timeline;
	currentIndex: number;

	calendarInfo: CalendarInfo;
	chartSize: ChartSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	updateRelations: () => void;

	timelineStore: TimelineStore;
}

