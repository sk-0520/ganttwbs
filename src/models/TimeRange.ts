import { Timeline } from "./data/Setting";

export type TimeRangeKind =
	"success"
	|
	"loading"
	|
	"no-input"
	|
	"self-selected-error"
	|
	"no-children"
	|
	"relation-no-input"
	|
	"relation-error"
	|
	"unknown-error"
	;

export interface TimeRange {
	kind: TimeRangeKind;
	timeline: Timeline;
}

export interface SuccessTimeRange extends TimeRange {
	kind: "success";
	begin: Date;
	end: Date;
}

export class TimeRanges {

	/**
	 * `TimeRange` は `SuccessTimeRange` か。
	 * 本処理は型ガードではあるものの方チェックは行わない。
	 * @param timeRange
	 * @returns
	 */
	public static maybeSuccessTimeRange(timeRange: TimeRange): timeRange is SuccessTimeRange {
		return timeRange.kind === "success";
	}

	public static isError(timeRange: TimeRange): boolean {
		const errorKinds: Array<TimeRangeKind> = [
			"no-input",
			"relation-error",
			"relation-no-input",
			"unknown-error",
		];

		return errorKinds.includes(timeRange.kind);
	}

	public static getMinMaxRange(items: ReadonlyArray<SuccessTimeRange>): { min: SuccessTimeRange, max: SuccessTimeRange } {
		const minItems = [...items].sort((a, b) => a.begin.getTime() - b.begin.getTime());
		const maxItems = [...items].sort((a, b) => a.end.getTime() - b.end.getTime());

		return {
			min: minItems[0],
			max: maxItems[maxItems.length - 1],
		};
	}

	public static maxByEndDate(items: ReadonlyArray<SuccessTimeRange>): SuccessTimeRange {
		const sortedItems = [...items].sort((a, b) => a.end.getTime() - b.end.getTime());
		return sortedItems[sortedItems.length - 1];
	}

}
