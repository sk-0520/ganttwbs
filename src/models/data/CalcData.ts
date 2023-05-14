import { DateTimeTicks } from "@/models/DateTime";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { DayInfo } from "@/models/data/DayInfo";
import { ResourceInfo } from "@/models/data/ResourceInfo";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";
import { WorkRange } from "@/models/data/WorkRange";

export interface CalcData {
	calendarInfo: CalendarInfo;
	resourceInfo:ResourceInfo;
	sequenceTimelines:Array<AnyTimeline>
	timelineMap:Map<TimelineId, AnyTimeline>;
	workRanges: Map<TimelineId, WorkRange>;
	dayInfos:  Map<DateTimeTicks, DayInfo>;
}
