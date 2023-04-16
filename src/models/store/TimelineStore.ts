import { AnyTimeline, TimelineId } from "../data/Setting";
import { TimelineItem } from "../data/TimelineItem";
import { WorkRange } from "../data/WorkRange";

export interface TimelineStore {

	/** ノード状態全アイテム */
	readonly nodeItems: ReadonlyArray<AnyTimeline>;
	/** 全てのタイムライン(ノード状態ではない) */
	readonly totalItems: ReadonlyMap<TimelineId, AnyTimeline>;

	/** 変更タイムライン */
	readonly changedItems: ReadonlyMap<TimelineId, TimelineItem>;

	readonly workRanges: ReadonlyMap<TimelineId, WorkRange>;

	/**
	 * タイムラインを更新。
	 * @param timeline
	 */
	updateTimeline(timeline: AnyTimeline): void;
	/**
	 * タイムラインを破棄。
	 * @param timeline
	 */
	removeTimeline(timeline: AnyTimeline): void;
}
