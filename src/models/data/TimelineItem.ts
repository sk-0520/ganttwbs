import { DateTimeRange } from "./DateTimeRange";
import { GroupTimeline, TaskTimeline } from "./Setting";

export interface TimelineItem {
	timeline: GroupTimeline | TaskTimeline;
	range: DateTimeRange;
}
