import { AnyTimeline } from "@/models/data/Setting";
import { WorkRange } from "@/models/data/WorkRange";

export interface TimelineItem {
	timeline: AnyTimeline;
	range?: WorkRange;
}
