import { HolidayEventMap, HolidayRegulars } from "@/models/data/Calendar";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { DateTimeRange } from "@/models/data/Range";
import { Calendar, Holiday } from "@/models/data/Setting";
import { DateTime, DateTimeTicks } from "@/models/DateTime";
import { Settings } from "@/models/Settings";
import { TimeZone } from "@/models/TimeZone";

export abstract class Calendars {

	private static createHolidayEventMap(events: Holiday["events"], timeZone: TimeZone): Map<DateTimeTicks, HolidayEventMapValue> {
		const result = new Map<DateTimeTicks, HolidayEventMapValue>();

		for (const [k, v] of Object.entries(events)) {
			const date = DateTime.parse(k, timeZone);
			const value: HolidayEventMapValue = {
				date: date,
				event: v,
			};
			result.set(date.ticks, value);
		}

		return result;
	}

	public static createCalendarInfo(rawTimeZone: string, calendar: Calendar): CalendarInfo {
		const timeZone = TimeZone.parse(rawTimeZone);

		const range: DateTimeRange = {
			begin: DateTime.parse(calendar.range.begin, timeZone),
			end: DateTime.parse(calendar.range.end, timeZone),
		};

		const holidayEventMap = this.createHolidayEventMap(calendar.holiday.events, timeZone);

		const result: CalendarInfo = {
			timeZone: timeZone,
			range: range,
			holidayEventMap: holidayEventMap,
			holidayRegulars: new Set(calendar.holiday.regulars.map(a => Settings.toWeekIndex(a))),
		};

		return result;
	}

	/**
	 * カレンダー範囲から日数を取得。
	 * @param calendarRange
	 * @returns
	 */
	public static getCalendarRangeDays(calendarRange: Readonly<DateTimeRange>): number {
		const diff = calendarRange.begin.diff(calendarRange.end);
		const days = Math.floor(diff.totalDays) + 1;
		return days;
	}

	/**
	 * 開始・終了日からその期間の日を配列として取得する。
	 * @param begin 開始日
	 * @param end 終了日(終了日が `00:00:00.0` の場合、その日は含まれない)
	 * @returns
	 */
	public static getDays(range: DateTimeRange): Array<DateTime> {
		const base = range.begin.truncateTime();

		const diff = base.diff(range.end.truncateTime()).totalDays;

		const result = new Array<DateTime>();
		result.push(range.begin);
		for (let i = 1; i < diff; i++) {
			result.push(base.add(i, "day"));
		}

		if (1 <= diff && !range.end.timeIsEmpty) {
			result.push(range.end);
		}

		return result;
	}

	/**
	 * 開始日・終了日からその期間の月数を取得する。
	 * @param begin
	 * @param end
	 * @returns
	 */
	public static getMonthCount(begin: DateTime, end: DateTime): number {
		const b = begin.year * 12 + begin.month;
		const e = end.year * 12 + end.month;
		const diff = e - b;

		return Math.floor(diff) + 1;
	}

	/**
	 * 開始・終了日からその期間の月を配列として取得する。
	 * @param begin
	 * @param end
	 * @returns
	 */
	public static getMonths(begin: DateTime, end: DateTime): Array<DateTime> {
		const count = this.getMonthCount(begin, end);

		const result = new Array<DateTime>();
		result.push(begin);

		for (let i = 1; i < count - 1; i++) {
			result.push(DateTime.create(
				begin.timeZone,
				begin.year,
				begin.month + i
			));
		}
		if(1 < count) {
			result.push(end);
		}

		return result;
	}

	public static isHoliday(date: DateTime, holidayRegulars: HolidayRegulars, holidayEventMap: HolidayEventMap): boolean {
		const holidayEvent = holidayEventMap.get(date.ticks);
		if (holidayEvent) {
			return true;
		}

		return holidayRegulars.has(date.week);
	}

	/**
	 * 開始日・終了日からその期間の稼働日を取得
	 * @param range 開始日・終了日(終了日の扱いは `Calendars.getDays` を参照のこと)
	 * @param holidayRegulars
	 * @param holidayEventMap
	 * @returns
	 */
	public static getWorkDays(range: DateTimeRange, holidayRegulars: HolidayRegulars, holidayEventMap: HolidayEventMap): Array<DateTime> {
		const rangeDays = this.getDays(range);

		const workDays = rangeDays.filter(a => !this.isHoliday(a.timeIsEmpty ? a: a.truncateTime(), holidayRegulars, holidayEventMap));

		return workDays;
	}
}
