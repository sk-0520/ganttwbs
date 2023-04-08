import { TimeSpan } from "../TimeSpan";

export interface TimeZone {
	/**
	 * UTC からの位置。
	 */
	readonly offset: TimeSpan;
}
