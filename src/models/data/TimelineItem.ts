import { AnyTimeline } from "@/models/data/Setting";
import { WorkRange } from "@/models/data/WorkRange";

export interface TimelineItem {
	/** 対象タイムライン */
	timeline: AnyTimeline;

	/** 工数範囲 */
	workRange?: WorkRange;

	/** ホバー中か(`undefined` は現在状態を維持) */
	isHover?: boolean;
	/** アクティブか(`undefined` は現在状態を維持) */
	isActive?: boolean;
}
