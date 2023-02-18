import { Color } from "./Color";
import * as ISO8601 from "./ISO8601";

export type TimelineKind =
	'marker'
	|
	'pin'
	|
	'timeline'
	;

export interface TimeLineBase {
	kind: TimelineKind;
	color: Color;
	subject: string;
	comment: string;
}

export type MarkerTimeLineScope =
	'global'
	|
	'local'
	|
	'slim'
	;

export interface MarkerTimeLine extends TimeLineBase {
	kind: 'marker';
	scope: MarkerTimeLineScope;
	target: ISO8601.DateTime;
	range: ISO8601.Time;
}

export type PinTimeLineScope =
	'pin'
	|
	'line'
	;

export interface PinTimeLine extends TimeLineBase {
	kind: 'pin';
	scope: PinTimeLineScope;
	target: ISO8601.DateTime;
}

export type TimeLineId = string;
export type TimeLineType =
	'group'
	|
	'item'
	;

export interface TimeLineGroup { }

export interface TimeLineItem {
	static: {
		target: ISO8601.DateTime;
	},
	prev: {
		items: Array<TimeLineId>;
	}
}

export interface TimeLine extends TimeLineBase {
	kind: 'timeline';
	id: TimeLineId;
	group: TimeLineGroup;
	item: TimeLineItem;
}
