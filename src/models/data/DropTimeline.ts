import { GroupTimeline, TaskTimeline } from "@/models/data/Setting";

export interface DropTimeline {
	/**
	 * 対象のタイムライン。
	 */
	timeline: GroupTimeline | TaskTimeline;
	/**
	 * `timeline` が所属していたグループ。
	 */
	sourceGroupTimeline: GroupTimeline;
	/**
	 * `sourceGroupTimeline` から見た位置。
	 * 最上位の場合はノードの位置(意味的に同じ)
	 */
	sourceIndex: number;
	/**
	 * `timeline` が新たに所属するグループ。
	 */
	destinationGroupTimeline: GroupTimeline;
	/**
	 * `destinationGroupTimeline` の何番目に挿入されるか。
	 * `-1` は最後尾。
	 */
	destinationIndex: number;
}
