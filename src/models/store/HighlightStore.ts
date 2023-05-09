import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";

/**
 * 強調。
 */
export interface HighlightCallbackStore {
	/**
	 * ライムラインホバー状態設定。
	 * @param timelineId
	 */
	//setHoverTimeline(timelineId: TimelineId | undefined): void;
	/**
	 * ライムラインアクティブ状態設定。
	 * @param timelineId
	 */
	setActiveTimeline(timelineId: TimelineId | undefined): void;
	/**
	 * ライムライン強調状態設定。
	 * @param timelineIds
	 */
	setHighlights(timelineIds: ReadonlyArray<TimelineId>, days: ReadonlyArray<DateTime>): void;
}

export interface HighlightValueStore {
	readonly activeTimelineId: TimelineId | undefined;
	readonly hoverTimelineId: TimelineId | undefined;
	readonly highlightTimelineIds: ReadonlyArray<TimelineId>;
	readonly highlightDays: ReadonlyArray<DateTime>;
}
