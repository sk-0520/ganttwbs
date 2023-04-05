import { AnyTimeline, GroupTimeline, TaskTimeline, TimelineId } from "../data/Setting";
import { TimelineItem } from "../data/TimelineItem";

export interface TimelineStore {
	items: Map<TimelineId, TimelineItem>;
	updateTimeline(timeline: AnyTimeline): void;
}
