import { TaskTimeline, Timeline, TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";


export interface SelectingBeginDate {
	timeline: TaskTimeline;
	beginDate: DateTime | null;
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
