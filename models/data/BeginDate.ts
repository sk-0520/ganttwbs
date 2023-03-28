import { TaskTimeline, TimelineId } from "./Setting";

export interface SelectingBeginDate {
	timeline: TaskTimeline;
	beginDate: Date | null;
	previous: Set<TimelineId>;
}

export interface BeginDateCallbacks {
	callbackStartSelectBeginDate(timeline: TaskTimeline): void;
	callbackClearSelectBeginDate(timeline: TaskTimeline): void;
	callbackSubmitSelectBeginDate(timeline: TaskTimeline): void;
	callbackCancelSelectBeginDate(timeline: TaskTimeline): void;
}
