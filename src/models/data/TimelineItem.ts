import { DateTimeRange } from "./DateTimeRange";
import { AnyTimeline } from "./Setting";

export interface TimelineItem {
	timeline: AnyTimeline;
	range?: DateTimeRange;
}
