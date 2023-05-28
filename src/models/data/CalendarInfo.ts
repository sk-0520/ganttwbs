import { HolidayEventMap, HolidayRegulars } from "@/models/data/Calendar";
import { DateTimeRange } from "@/models/data/Range";
import { TimeZone } from "@/models/TimeZone";

/**
 * カレンダー情報。
 *
 * 編集中は変わらないので計算済みの値をここに保管しておくイメージ。
 */
export interface CalendarInfo {
	/** 基準となるタイムゾーン */
	readonly timeZone: TimeZone;
	/** 日付範囲 */
	readonly range: DateTimeRange;
	/** 祝日設定 */
	readonly holidayEventMap: HolidayEventMap;
	/** 定休設定 */
	readonly holidayRegulars: HolidayRegulars;
}
