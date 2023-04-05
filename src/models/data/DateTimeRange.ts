import { Timeline } from "./Setting";

export type DateTimeRangeKind =
	"success"
	|
	"loading"
	|
	"no-input"
	|
	"self-selected-error"
	|
	"no-children"
	|
	"relation-no-input"
	|
	"relation-error"
	|
	"unknown-error"
	;


export interface DateTimeRange {
	kind: DateTimeRangeKind;
	timeline: Timeline;
}

export interface SuccessDateTimeRange extends DateTimeRange {
	kind: "success";
	begin: Date;
	end: Date;
}

export interface SuccessRange {
	minimum: SuccessDateTimeRange;
	maximum: SuccessDateTimeRange;
 }
