import { CalendarInfo } from "@/models/data/CalendarInfo";
import { CalendarRange } from "@/models/data/CalendarRange";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
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

		const range: CalendarRange = {
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
	public static getCalendarRangeDays(calendarRange: Readonly<CalendarRange>): number {
		const diff = calendarRange.begin.diff(calendarRange.end);
		const days = Math.floor(diff.totalDays) + 1;
		return days;
	}

	/**
	 * 開始・終了日からその期間の日を配列として取得する。
	 * @param begin
	 * @param end
	 * @returns
	 */
	public static getDays(begin: DateTime, end: DateTime): Array<DateTime> {
		const base = begin.truncateTime();

		const diff = base.diff(end.truncateTime()).totalDays;

		const result = new Array<DateTime>();
		result.push(begin);
		for (let i = 1; i < diff; i++) {
			result.push(base.add(i, "day"));
		}

		if (1 <= diff && !end.timeIsZero) {
			result.push(end);
		}

		return result;
	}

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
		const count = this.getMonthCount(begin,end);

		const result = new Array<DateTime>();
		for (let i = 0; i < count - 1; i++) {
			if (i) {
				result.push(DateTime.create(
					begin.timeZone,
					begin.year,
					begin.month + i
				));
			} else {
				result.push(begin);
			}
		}
		result.push(end);

		return result;
	}
}
