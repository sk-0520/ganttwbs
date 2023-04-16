import { GroupTimeline, TaskTimeline } from "@/models/data/Setting";

export interface DropTimeline {
	/**
	 * 対象のタイムライン。
	 */
	timeline: GroupTimeline | TaskTimeline;
	/**
	 * `dropTimeline` が所属していたグループ。
	 * 最上位の場合は `null`
	 */
	sourceGroupTimeline: GroupTimeline | null;
	/**
	 * `sourceGroupTimeline` から見た位置。
	 * 最上位の場合はノードの位置(意味的に同じ)
	 */
	sourceIndex: number;
	/**
	 * `dropTimeline` が新たに所属するグループ。
	 * 最上位の場合は `null`
	 */
	destinationGroupTimeline: GroupTimeline | null;
	/**
	 * `destinationGroupTimeline` の何番目に挿入されるか。
	 * `-1` は最後尾。
	 */
	destinationIndex: number;
}
