import { DragEvent } from "react";

import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";
import { TimelineItem } from "@/models/data/TimelineItem";
import { WorkRange } from "@/models/data/WorkRange";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";

export interface TimelineStore {

	/** ノード状態全アイテム */
	readonly nodeItems: ReadonlyArray<AnyTimeline>;

	/** 全てのタイムライン(ノード状態ではない) */
	readonly totalItemMap: ReadonlyMap<TimelineId, AnyTimeline>;

	/** 各タイムラインを上から見たインデックス順の一覧 */
	readonly sequenceItems: ReadonlyArray<AnyTimeline>;
	/** 各タイムラインを上から見たインデックスのマッピング */
	readonly indexItemMap: ReadonlyMap<TimelineId, number>;

	/** 変更タイムライン */
	readonly changedItemMap: ReadonlyMap<TimelineId, TimelineItem>;

	/** 各工数時間 */
	readonly workRanges: ReadonlyMap<TimelineId, WorkRange>;

	/** ホバー状態タイムライン */
	readonly hoverItem: AnyTimeline | null;
	/** アクティブ状態タイムライン */
	readonly activeItem: AnyTimeline | null;

	/**
	 * タイムライン追加。
	 * @param baseTimeline 追加するタイムラインの基準タイムライン。
	 * @param options 追加方法。
	 */
	addEmptyTimeline(baseTimeline: AnyTimeline | null, options: NewTimelineOptions): void;
	/**
	 * タイムライン追加。
	 * @param baseTimeline
	 * @param newTimeline
	 * @param position
	 */
	addNewTimeline(baseTimeline: AnyTimeline | null, newTimeline: AnyTimeline, position: NewTimelinePosition): void;
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
	 * ホバー状態設定。
	 * @param timeline
	 */
	setHoverTimeline(timeline: AnyTimeline | null): void;
	/**
	 * アクティブ状態設定。
	 * @param timeline
	 */
	setActiveTimeline(timeline: AnyTimeline | null): void;

	/**
	 * D&D処理を開始
	 * @param event
	 * @param sourceTimeline
	 */
	startDragTimeline(event: DragEvent, sourceTimeline: AnyTimeline): void;
}


