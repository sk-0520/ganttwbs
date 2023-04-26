import { AnyTimeline } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";

export type WorkRangeKind
	= "success"
	| "loading"
	| "no-input"
	| "self-selected-error"
	| "no-children"
	| "relation-no-input"
	| "relation-error"
	| "recursive-error"
	| "unknown-error"
	;

/** 工数範囲(使えるかどうかは `kind` 次第) */
export interface WorkRange {
	kind: WorkRangeKind;
	timeline: AnyTimeline;
}

export interface ErrorWorkRange {
	kind: Omit<WorkRangeKind, "success" | "loading">;
	timeline: AnyTimeline;
}

export interface RecursiveCalculationErrorWorkRange extends ErrorWorkRange {
	kind: "recursive-error";
}

/** 有効工数範囲 */
export interface SuccessWorkRange extends WorkRange {
	kind: "success";
	begin: DateTime;
	end: DateTime;
}

/** 有効工数範囲の最小・最大範囲 */
export interface TotalSuccessWorkRange {
	minimum: SuccessWorkRange;
	maximum: SuccessWorkRange;
}
