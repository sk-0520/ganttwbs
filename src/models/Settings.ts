import { GroupTimeline, TaskTimeline, Timeline, WeekDay, WeekIndex } from "./data/Setting";

export abstract class Settings {

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
	 * `Timeline` は `GroupTimeline` か。
	 * 本処理は型ガードではあるものの方チェックは行わない。すでに型ガードを通過していることを想定している。
	 * @param timeline
	 * @returns
	 */
	public static maybeGroupTimeline(timeline: Timeline): timeline is GroupTimeline {
		return timeline.kind === "group";
	}
	/**
	 * `Timeline` は `TaskTimeline` か。
	 * 本処理は型ガードではあるものの方チェックは行わない。すでに型ガードを通過していることを想定している。
	 * @param timeline
	 * @returns
	 */
	public static maybeTaskTimeline(timeline: Timeline): timeline is TaskTimeline {
		return timeline.kind === "task";
	}

}

