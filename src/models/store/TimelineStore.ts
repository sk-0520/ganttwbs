import { DragEvent } from "react";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";
import { TimelineItem } from "@/models/data/TimelineItem";
import { WorkRange } from "@/models/data/WorkRange";
import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";

export interface TimelineStore {

	/** ノード状態全アイテム */
	readonly nodeItems: ReadonlyArray<AnyTimeline>;
	/** 全てのタイムライン(ノード状態ではない) */
	readonly totalItems: ReadonlyMap<TimelineId, AnyTimeline>;

	/** 変更タイムライン */
	readonly changedItems: ReadonlyMap<TimelineId, TimelineItem>;

	/** 各工数時間 */
	readonly workRanges: ReadonlyMap<TimelineId, WorkRange>;

	/**
	 * タイムライン追加。
	 * @param timeline 追加するタイムラインの基準タイムライン。
	 * @param options 追加方法。
	 */
	addTimeline(timeline: AnyTimeline | null, options: NewTimelineOptions): void;
	/**
	 * タイムラインを更新。
	 * @param timeline
	 */
	updateTimeline(timeline: AnyTimeline): void;
	/**
	 * タイムラインをグループ内で上下移動。
	 * @param moveUp 上へ移動するか。
	 * @param timeline 対象タイムライン。
	 */
	moveTimeline(moveUp: boolean, timeline: AnyTimeline): void;
	/**
	 * タイムラインを破棄。
	 * @param timeline
	 */
	removeTimeline(timeline: AnyTimeline): void;

	/**
	 * D&D処理を開始
	 * @param event
	 * @param sourceTimeline
	 */
	startDragTimeline(event: DragEvent, sourceTimeline: AnyTimeline): void;

}
