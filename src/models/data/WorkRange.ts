import { DateTimeRange } from "@/models/data/Range";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";

/**
 * 工数範囲計算状態。
 */
export const enum WorkRangeKind {
	/** 成功 */
	Success,
	/** 読み込み中 */
	Loading,
	/** 未入力 */
	NoInput,
	/** 自身を選択 */
	SelfSelectedError,
	/** 子なし */
	NoChildren,
	/** 関連タイムライン未入力 */
	RelationNoInput,
	/** 関連タイムラインエラー */
	RelationError,
	/** 反復計算上限エラー */
	RecursiveError,
	/** なんか知らんけどエラー */
	UnknownError,
}

/** 工数範囲(使えるかどうかは `kind` 次第) */
export interface WorkRange {
	kind: WorkRangeKind;
	timeline: AnyTimeline;
}

export interface ErrorWorkRange {
	kind: Omit<WorkRangeKind, WorkRangeKind.Success | WorkRangeKind.Loading>;
	timeline: AnyTimeline;
}

/**
 * 反復計算上限エラー。
 */
export interface RecursiveCalculationErrorWorkRange extends ErrorWorkRange {
	kind: WorkRangeKind.RecursiveError;
}

/** 有効工数範囲 */
export interface SuccessWorkRange extends WorkRange, DateTimeRange {
	kind: WorkRangeKind.Success;
}

/** 有効工数範囲の最小・最大範囲 */
export interface TotalSuccessWorkRange {
	minimum: SuccessWorkRange;
	maximum: SuccessWorkRange;
}

export interface SuccessTimelineId {
	timelineId: TimelineId;
	workRange: SuccessWorkRange;
}

export interface SuccessTimelineIdRange {
	begin: SuccessTimelineId | undefined;
	end: SuccessTimelineId | undefined;
}
