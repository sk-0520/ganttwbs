
import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { ReadableTimelineId } from "@/models/data/ReadableTimelineId";
import { AnyTimeline } from "@/models/data/Setting";

export type MoveDirection = "up" | "down" | "parent";

export interface TimelineCallbacks {
	/**
	 * タイムラインの表示上IDを取得。
	 */
	calcReadableTimelineId(timeline: AnyTimeline): ReadableTimelineId;
	/**
	 * 指定タイムラインの直近のタイムラインを取得。
	 */
	searchBeforeTimeline(timeline: AnyTimeline): AnyTimeline | undefined;

	/**
	 * タイムライン追加。
	 * @param baseTimeline 追加するタイムラインの基準タイムライン。
	 * @param options 追加方法。
	 */
	addEmptyTimeline(baseTimeline: AnyTimeline, options: NewTimelineOptions): void;
	/**
	 * タイムライン追加。
	 * @param baseTimeline
	 * @param newTimeline
	 * @param position
	 */
	addNewTimeline(baseTimeline: AnyTimeline, newTimeline: AnyTimeline, position: NewTimelinePosition): void;
	/**
	 * タイムラインを更新。
	 * @param timeline
	 */
	updateTimeline(timeline: AnyTimeline): void;
	/**
	 * タイムラインをグループ内で上下移動。
	 * @param direction 移動方向。
	 * @param timeline 対象タイムライン。
	 */
	moveTimeline(direction: MoveDirection, timeline: AnyTimeline): void;
	/**
	 * タイムラインを破棄。
	 * @param timeline
	 */
	removeTimeline(timeline: AnyTimeline): void;

	// /**
	//  * D&D処理を開始
	//  * @param event
	//  * @param sourceTimeline
	//  */
	// startDragTimeline(event: DragEvent, sourceTimeline: AnyTimeline): void;
}


