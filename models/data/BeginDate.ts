import { TaskTimeline, Timeline, TimelineId } from "./Setting";

export interface SelectingBeginDate {
	timeline: TaskTimeline;
	beginDate: Date | null;
	previous: Set<TimelineId>;
	canSelect(timeline: Timeline): boolean;
}

export interface BeginDateCallbacks {
	startSelectBeginDate(timeline: TaskTimeline): void;
	clearSelectBeginDate(timeline: TaskTimeline): void;
	submitSelectBeginDate(timeline: TaskTimeline): void;
	cancelSelectBeginDate(timeline: TaskTimeline): void;
}
