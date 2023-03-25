import { TaskTimeline, TimelineId } from "./Setting";

export default interface SelectingBeginDate {
	timeline: TaskTimeline;
	beginDate: Date | null;
	previous: Set<TimelineId>;
}
