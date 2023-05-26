import { DateTime } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";

export interface Range<T> {
	/** 開始。 */
	readonly begin: T;
	/** 終了(このデータを含む)。 */
	readonly end: T;
}

export type DateTimeRange = Range<DateTime>;
export type TimeSpanRange = Range<TimeSpan>;
