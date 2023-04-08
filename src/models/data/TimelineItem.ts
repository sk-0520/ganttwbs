import { AnyTimeline } from "./Setting";
import { WorkRange } from "./WorkRange";

export interface TimelineItem {
	timeline: AnyTimeline;
	range?: WorkRange;
}
