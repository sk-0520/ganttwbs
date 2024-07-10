import type { CalendarInfo } from "@/models/data/CalendarInfo";
import type { DayInfo } from "@/models/data/DayInfo";
import type { ResourceInfo } from "@/models/data/ResourceInfo";
import type { Result } from "@/models/data/Result";
import type { AnyTimeline, TimelineId } from "@/models/data/Setting";
import type {
	SuccessWorkRange,
	TotalSuccessWorkRange,
	WorkRange,
} from "@/models/data/WorkRange";
import type { DateTimeTicks } from "@/models/DateTime";

export interface CalculatedData {
	calendarInfo: CalendarInfo;
	resourceInfo: ResourceInfo;
	sequenceTimelines: Array<AnyTimeline>;
	timelineMap: Map<TimelineId, AnyTimeline>;
	dayInfos: Map<DateTimeTicks, DayInfo>;
	workRange: {
		baseRanges: Map<TimelineId, WorkRange>;
		successWorkRanges: Array<SuccessWorkRange>;
		totalSuccessWorkRange: Result<TotalSuccessWorkRange, never>;
	};
}
