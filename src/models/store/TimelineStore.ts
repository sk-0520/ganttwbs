import { DragEvent } from "react";

import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { AnyTimeline, GroupTimeline, TimelineId } from "@/models/data/Setting";
import { TimelineIndex } from "@/models/data/TimelineIndex";
import { TimelineItem } from "@/models/data/TimelineItem";
import { WorkRange } from "@/models/data/WorkRange";

export interface TimelineStore {

	/** 最上位(こいつ自身はどうでもよくて、子を使用する) */
	readonly rootGroupTimeline: GroupTimeline;

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
	 * タイムラインの表示上IDを取得。
	 */
	getIndex(timeline: AnyTimeline): TimelineIndex;
	/**
	 * 指定タイムラインの直近のタイムラインを取得。
	 */
	getBeforeTimeline(timeline: AnyTimeline): AnyTimeline | undefined;

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


