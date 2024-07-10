import type { HolidayEvent } from "@/models/data/Setting";
import type { DateTime } from "@/models/DateTime";

/**
 * 祝日マッピング。
 */
export interface HolidayEventMapValue {
	/** 該当日 */
	date: DateTime;
	/** イベント情報 */
	event: HolidayEvent;
}
