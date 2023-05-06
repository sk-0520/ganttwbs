import { DragEvent } from "react";

import { DayInfo } from "@/models/data/DayInfo";
import { DisplayTimelineId } from "@/models/data/DisplayTimelineId";
import { NewTimelineOptions } from "@/models/data/NewTimelineOptions";
import { NewTimelinePosition } from "@/models/data/NewTimelinePosition";
import { AnyTimeline, DateOnly, GroupTimeline, TimelineId } from "@/models/data/Setting";
import { TimelineItem } from "@/models/data/TimelineItem";
import { WorkRange } from "@/models/data/WorkRange";

export type MoveDirection = "up" | "down" | "parent";

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

	/** 日に対する何かしらの情報(情報がある時点で死んでる) */
	readonly dayInfos: ReadonlyMap<DateOnly, DayInfo>;

	/** ホバー状態タイムライン */
	readonly hoverItem: AnyTimeline | null;
	/** アクティブ状態タイムライン */
	readonly activeItem: AnyTimeline | null;

	/**
	 * タイムラインの表示上IDを取得。
	 */
	calcDisplayId(timeline: AnyTimeline): DisplayTimelineId;
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

	startDetailEdit(timeline: AnyTimeline): void;
}


