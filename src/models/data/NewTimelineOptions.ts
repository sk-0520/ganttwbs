import { TimelineKind } from "@/models/data/Setting";

export interface NewTimelineOptions {
	timelineKind: TimelineKind;
	/**
	 * 対象タイムラインから見た追加位置。
	 */
	position: "next";
}
