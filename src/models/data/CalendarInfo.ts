import { TimeZone } from "@/models/TimeZone";

import { CalendarRange } from "./CalendarRange";
import { HolidayEventMapValue } from "./HolidayEventMapValue";

/**
 * カレンダー情報。
 *
 * 編集中は変わらないので計算済みの値をここに保管しておくイメージ。
 */
export interface CalendarInfo {
	/** 基準となるタイムゾーン */
	readonly timeZone: TimeZone;
	/** 日付範囲 */
	readonly range: CalendarRange;
	/** 祝日設定(該当祝日の基準タイムゾーン00:00:00のUNIX時間がキーとなる) */
	readonly holidayEventMap: ReadonlyMap<number, HolidayEventMapValue>;
}
