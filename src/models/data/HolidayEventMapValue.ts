import { DateTime } from "../DateTime";
import { HolidayEvent } from "./Setting";

/**
 * 祝日マッピング。
 */
export interface HolidayEventMapValue {
	/** 該当日 */
	date: DateTime;
	/** イベント情報 */
	event: HolidayEvent;
}
