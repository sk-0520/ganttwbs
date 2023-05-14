import { CalendarInfo } from "@/models/data/CalendarInfo";
import { DayInfo } from "@/models/data/DayInfo";
import { ResourceInfo } from "@/models/data/ResourceInfo";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";
import { SuccessWorkRange, TotalSuccessWorkRange, WorkRange } from "@/models/data/WorkRange";
import { DateTimeTicks } from "@/models/DateTime";

export interface CalcData {
	calendarInfo: CalendarInfo;
	resourceInfo:ResourceInfo;
	sequenceTimelines:Array<AnyTimeline>
	timelineMap:Map<TimelineId, AnyTimeline>;
	dayInfos:  Map<DateTimeTicks, DayInfo>;
	workRange: {
		baseRanges: Map<TimelineId, WorkRange>;
		successWorkRanges: Array<SuccessWorkRange>;
		totalSuccessWorkRange: TotalSuccessWorkRange;
	}
}
