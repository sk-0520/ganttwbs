import { Color } from "./Color";
import * as ISO8601 from "./ISO8601";
import * as Member from "./Member";
import * as Version from "./Version";

export type TimelineKind =
	'marker'
	|
	'pin'
	|
	'task'
	;

export interface Timeline {
	kind: TimelineKind;
	subject: string;
	comment: string;
}

export type MarkerTimelineScope =
	'global'
	|
	'local'
	|
	'slim'
	;

export interface MarkerTimeline extends Timeline {
	kind: 'marker';
	color: Color;
	scope: MarkerTimelineScope;
	target: ISO8601.DateTime;
	range: ISO8601.Time;
}

export type PinTimelineScope =
	'pin'
	|
	'line'
	;

export interface PinTimeline extends Timeline {
	kind: 'pin';
	color: Color;
	scope: PinTimelineScope;
	target: ISO8601.DateTime;
}

export type TaskTimelineId = string;
export type TaskTimelineType =
	'group'
	|
	'item'
	;

export interface TaskTimelineGroup { }

type TaskTimelineItemWorkState =
	'enabled'
	|
	'disabled'
	|
	'sleep'
	;

type TaskTimelineItemWorkProgress = number;

export interface TaskTimelineItemWorkHistory {
	progress: TaskTimelineItemWorkProgress;
	version: Version.VersionId;
	more: ISO8601.Time;
}

export interface TaskTimelineItemWork {
	member: Member.MemberId;
	state: TaskTimelineItemWorkState;
	progress: TaskTimelineItemWorkProgress;
}

export interface TaskTimelineItem {
	static: {
		target: ISO8601.DateTime;
	},
	prev: {
		items: Array<TaskTimelineId>;
	}
	range: ISO8601.Time;
	works: Array<TaskTimelineItemWork>;
}

export interface TaskTimeline extends Timeline {
	kind: 'task';
	id: TaskTimelineId;
	group: TaskTimelineGroup;
	item: TaskTimelineItem;
}
