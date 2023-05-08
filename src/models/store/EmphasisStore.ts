import { TimelineId } from "@/models/data/Setting";

/**
 * 強調。
 */
export interface EmphasisStore {
	/** ホバー状態タイムライン */
	readonly hoverItem: TimelineId | undefined;
	/** アクティブ状態タイムライン */
	readonly activeItem: TimelineId | undefined;

	/**
	 * ホバー状態設定。
	 * @param timeline
	 */
	setHoverTimeline(timeline: TimelineId | undefined): void;
	/**
	 * アクティブ状態設定。
	 * @param timeline
	 */
	setActiveTimeline(timeline: TimelineId | undefined): void;
}
