import { TaskTimeline, Timeline, TimelineId } from "./Setting";

export interface SelectingBeginDate {
	timeline: TaskTimeline;
	beginDate: Date | null;
	previous: Set<TimelineId>;
	canSelect(timeline: Timeline): boolean;
}

export interface BeginDateCallbacks {
	startSelectBeginDate(timeline: TaskTimeline): void;
	clearSelectBeginDate(timeline: TaskTimeline, clearDate: boolean, clearPrevious: boolean): void;
	setSelectBeginDate(timeline: TaskTimeline, map: ReadonlySet<TimelineId>): void;
	submitSelectBeginDate(timeline: TaskTimeline): void;
	cancelSelectBeginDate(timeline: TaskTimeline): void;
}
