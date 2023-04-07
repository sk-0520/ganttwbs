import { DateTimeRange, DateTimeRangeKind, SuccessDateTimeRange, SuccessRange } from "./data/DateTimeRange";

export class DateTimeRanges {

	/**
	 * `TimeRange` は `SuccessTimeRange` か。
	 * 本処理は型ガードではあるものの方チェックは行わない。
	 * @param timeRange
	 * @returns
	 */
	public static maybeSuccessTimeRange(timeRange: DateTimeRange): timeRange is SuccessDateTimeRange {
		return timeRange.kind === "success";
	}

	public static isError(timeRange: DateTimeRange): boolean {
		const errorKinds: Array<DateTimeRangeKind> = [
			"no-input",
			"relation-error",
			"relation-no-input",
			"unknown-error",
		];

		return errorKinds.includes(timeRange.kind);
	}

	public static getMinMaxRange(items: ReadonlyArray<SuccessDateTimeRange>): SuccessRange {
		const minItems = [...items].sort((a, b) => a.begin.getTime() - b.begin.getTime());
		const maxItems = [...items].sort((a, b) => a.end.getTime() - b.end.getTime());

		const result: SuccessRange = {
			minimum: minItems[0],
			maximum: maxItems[maxItems.length - 1],
		};

		return result;
	}

	public static maxByEndDate(items: ReadonlyArray<SuccessDateTimeRange>): SuccessDateTimeRange {
		const sortedItems = [...items].sort((a, b) => a.end.getTime() - b.end.getTime());
		return sortedItems[sortedItems.length - 1];
	}

}
