import { AnyTimeline } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";

export type WorkRangeKind =
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
	"recursive-error"
	|
	"unknown-error";
export interface WorkRange {
	kind: WorkRangeKind;
	timeline: AnyTimeline;
}

export interface SuccessWorkRange extends WorkRange {
	kind: "success";
	begin: DateTime;
	end: DateTime;
}

export interface TotalSuccessWorkRange {
	minimum: SuccessWorkRange;
	maximum: SuccessWorkRange;
 }
