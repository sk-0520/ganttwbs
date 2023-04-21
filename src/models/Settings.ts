import { IdFactory } from "@/models/IdFactory";
import { AnyTimeline, GroupTimeline, RootTimeline, TaskTimeline, WeekDay, WeekIndex } from "@/models/data/Setting";

export abstract class Settings {

	/**
	 * 全ての `WeekDay` を取得。
	 * @returns
	 */
	public static getWeekDays(): Array<WeekDay> {
		return [
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday",
		];
	}

	/**
	 * JS:Date の曜日から `WeekDay` に変換。
	 * @param weekIndex
	 * @returns
	 */
	public static toWeekDay(weekIndex: number): WeekDay {
		switch (weekIndex) {
			case 0:
				return "sunday";
			case 1:
				return "monday";
			case 2:
				return "tuesday";
			case 3:
				return "wednesday";
			case 4:
				return "thursday";
			case 5:
				return "friday";
			case 6:
				return "saturday";

			default:
				throw new Error();
		}
	}

	/**
	 * `WeekDay` から JS:Date の曜日に変換。
	 * @param week
	 * @returns
	 */
	public static toWeekIndex(week: WeekDay): WeekIndex {
		switch (week) {
			case "sunday":
				return 0;
			case "monday":
				return 1;
			case "tuesday":
				return 2;
			case "wednesday":
				return 3;
			case "thursday":
				return 4;
			case "friday":
				return 5;
			case "saturday":
				return 6;

			default:
				throw new Error();
		}

	}

	/**
	 * `timeline` は `RootTimeline` か。
	 * 本処理は型ガードではあるものの型チェックは行わない。すでに型ガードを通過していることを想定している。
	 * @param timeline
	 * @returns
	 */
	public static maybeRootTimeline(timeline: AnyTimeline): timeline is RootTimeline {
		return timeline.id === IdFactory.rootTimelineId;
	}
	/**
	 * `timeline` は `GroupTimeline` か。
	 * 本処理は型ガードではあるものの型チェックは行わない。すでに型ガードを通過していることを想定している。
	 * @param timeline
	 * @returns
	 */
	public static maybeGroupTimeline(timeline: AnyTimeline): timeline is GroupTimeline {
		return timeline.kind === "group";
	}
	/**
	 * `timeline` は `TaskTimeline` か。
	 * 本処理は型ガードではあるものの型チェックは行わない。すでに型ガードを通過していることを想定している。
	 * @param timeline
	 * @returns
	 */
	public static maybeTaskTimeline(timeline: AnyTimeline): timeline is TaskTimeline {
		return timeline.kind === "task";
	}

}

