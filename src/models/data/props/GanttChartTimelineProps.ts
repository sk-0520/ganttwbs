import { GroupTimeline, MemberId, Timeline } from "@/models/data/Setting";
import { EditProps } from "./EditProps";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { ChartSize } from "@/models/data/ChartSize";
import { TimelineStore } from "@/models/store/TimelineStore";
import { CalendarInfo } from "@/models/data/CalendarInfo";

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

