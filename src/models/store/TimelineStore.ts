import { AnyTimeline, TimelineId } from "../data/Setting";
import { TimelineItem } from "../data/TimelineItem";

export interface TimelineStore {

	/** ノード状態全アイテム */
	readonly nodeItems: ReadonlyArray<AnyTimeline>;
	/** 全てのタイムライン(ノード状態ではない) */
	readonly totalItems: ReadonlyMap<TimelineId, AnyTimeline>;

	/** 変更タイムライン */
	readonly changedItems: ReadonlyMap<TimelineId, TimelineItem>;

	/**
	 * タイムラインを更新。
	 * @param timeline
	 */
	updateTimeline(timeline: AnyTimeline): void;
}
