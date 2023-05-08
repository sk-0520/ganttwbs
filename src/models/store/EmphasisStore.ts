import { DateTime } from "@/models/DateTime";
import { TimelineId } from "@/models/data/Setting";

/**
 * 強調。
 */
export interface EmphasisStore {
	/**
	 * ライムラインホバー状態設定。
	 * @param timelineId
	 */
	setHoverTimeline(timelineId: TimelineId | undefined): void;
	/**
	 * ライムラインアクティブ状態設定。
	 * @param timelineId
	 */
	setActiveTimeline(timelineId: TimelineId | undefined): void;
	/**
	 * ライムライン強調状態設定。
	 * @param timelineIds
	 */
	setEmphasis(timelineIds: ReadonlyArray<TimelineId>, days: ReadonlyArray<DateTime>): void;
}
