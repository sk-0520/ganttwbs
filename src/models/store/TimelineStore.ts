import { GroupTimeline, TaskTimeline, TimelineId } from "../data/Setting";
import { TimelineItem } from "../data/TimelineItem";

export interface TimelineStore {
	items: Map<TimelineId, TimelineItem>;
	updateGroup(timeline: GroupTimeline): void;
	updateTask(timeline: TaskTimeline): void;
}
