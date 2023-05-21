import { CalendarRange } from "@/models/data/CalendarRange";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { DateTimeTicks, WeekIndex } from "@/models/DateTime";
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
	readonly range: CalendarRange;
	/** 祝日設定(該当祝日の基準タイムゾーン00:00:00のUNIX時間がキーとなる) */
	readonly holidayEventMap: ReadonlyMap<DateTimeTicks, Readonly<HolidayEventMapValue>>;
	/** 定休設定 */
	readonly holidayRegulars: ReadonlySet<WeekIndex>;
}
