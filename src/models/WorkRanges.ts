import { TotalSuccessWorkRange, SuccessWorkRange, WorkRange, WorkRangeKind } from "@/models/data/WorkRange";

export class WorkRanges {

	/**
	 * `workRange` は `SuccessWorkRange` か。
	 * 本処理は型ガードではあるものの型チェックは行わない。
	 * @param workRange
	 * @returns
	 */
	public static maybeSuccessWorkRange(workRange: WorkRange | null | undefined): workRange is SuccessWorkRange {
		if (workRange) {
			return workRange.kind === WorkRangeKind.Success;
		}

		return false;
	}

	public static isError(workRange: WorkRange): boolean {
		const errorKinds: Array<WorkRangeKind> = [
			WorkRangeKind.NoInput,
			WorkRangeKind.RelationError,
			WorkRangeKind.RelationNoInput,
			WorkRangeKind.RecursiveError,
			WorkRangeKind.UnknownError,
		];

		return errorKinds.includes(workRange.kind);
	}

	public static getTotalSuccessWorkRange(items: ReadonlyArray<SuccessWorkRange>): TotalSuccessWorkRange {
		const minItems = [...items].sort((a, b) => a.begin.getTime() - b.begin.getTime());
		const maxItems = [...items].sort((a, b) => a.end.getTime() - b.end.getTime());

		const result: TotalSuccessWorkRange = {
			minimum: minItems[0],
			maximum: maxItems[maxItems.length - 1],
		};

		return result;
	}

	public static maxByEndDate(items: ReadonlyArray<SuccessWorkRange>): SuccessWorkRange {
		const sortedItems = [...items].sort((a, b) => a.end.getTime() - b.end.getTime());
		return sortedItems[sortedItems.length - 1];
	}

}
