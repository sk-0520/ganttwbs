import { CalendarInfo } from "@/models/data/CalendarInfo";
import { ChartSize } from "@/models/data/ChartSize";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { EditProps } from "@/models/data/props/EditProps";
import { GroupTimeline, MemberId, Timeline } from "@/models/data/Setting";
import { TimelineStore } from "@/models/store/TimelineStore";


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

