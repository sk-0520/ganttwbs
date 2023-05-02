import { Arrays } from "@/models/Arrays";
import { IdFactory } from "@/models/IdFactory";
import { TimelineId } from "@/models/data/Setting";
import { TotalSuccessWorkRange, SuccessWorkRange, WorkRange, WorkRangeKind, SuccessTimelineIdRange } from "@/models/data/WorkRange";

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

	public static getSuccessTimelineIdRange(workRanges: ReadonlyMap<TimelineId, Readonly<WorkRange>>, includeRoot?: boolean): SuccessTimelineIdRange {
		const successPairs = [...workRanges]
			.filter(([k, _]) => includeRoot ? true : k !== IdFactory.rootTimelineId)
			.filter(([_, v]) => this.maybeSuccessWorkRange(v))
			.map(([k, v]) => ({ timelineId: k, workRange: v as SuccessWorkRange }))
			;

		const begins = [...successPairs].sort((a, b) => a.workRange.begin.compare(b.workRange.begin));
		const ends = [...successPairs].sort((a, b) => a.workRange.end.compare(b.workRange.end));

		const result: SuccessTimelineIdRange = {
			begin: begins.length ? begins[0] : undefined,
			end: ends.length ? Arrays.last(ends) : undefined,
		};

		return result;
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
