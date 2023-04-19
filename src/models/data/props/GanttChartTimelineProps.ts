import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { EditProps } from "@/models/data/props/EditProps";
import { GroupTimeline, MemberId, AnyTimeline } from "@/models/data/Setting";
import { TimelineStore } from "@/models/store/TimelineStore";


export interface GanttChartTimelineProps extends EditProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: AnyTimeline;
	currentIndex: number;

	calendarInfo: CalendarInfo;
	chartSize: AreaSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	updateRelations: () => void;

	timelineStore: TimelineStore;
}

