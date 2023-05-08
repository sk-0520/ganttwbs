import { TimelineId } from "@/models/data/Setting";

/**
 * 強調。
 */
export interface EmphasisStore {
	/**
	 * ホバー状態設定。
	 * @param timelineId
	 */
	setHoverTimeline(timelineId: TimelineId | undefined): void;
	/**
	 * アクティブ状態設定。
	 * @param timelineId
	 */
	setActiveTimeline(timelineId: TimelineId | undefined): void;
	setEmphasisTimelines(timelineIds: ReadonlyArray<TimelineId>): void;
}
