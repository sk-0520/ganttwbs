import { CalendarInfo } from "@/models/data/CalendarInfo";
import { CalendarRange } from "@/models/data/CalendarRange";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { Calendar, Holiday } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { TimeZone } from "@/models/TimeZone";

export abstract class Calendars {

	private static createHolidayEventMap(events: Holiday["events"], timeZone: TimeZone): Map<number, HolidayEventMapValue> {
		const result = new Map<number, HolidayEventMapValue>();

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
		const days = diff.totalDays + 1;
		return days;
	}

	public static getHolidayEventValue(target: DateTime, eventMap: ReadonlyMap<number, Readonly<HolidayEventMapValue>>): Readonly<HolidayEventMapValue> | null {
		const value = eventMap.get(target.ticks);

		if (!value) {
			return null;
		}

		return value;
	}

	public static getDays(begin: DateTime, end: DateTime): Array<DateTime> {
		const diff = begin.diff(end).totalDays;

		const base = begin.toDateOnly();

		const result = new Array<DateTime>();
		for (let i = 0; i < diff; i++) {
			if (i) {
				result.push(base.add(i, "day"));
			} else {
				result.push(begin);
			}
		}
		result.push(end);

		return result;
	}

	public static getMonths(begin: DateTime, end: DateTime): Array<DateTime> {
		const b = begin.year * 12 + begin.month;
		const e = end.year * 12 + end.month;
		const diff = e - b;

		const result = new Array<DateTime>();
		for (let i = 0; i < diff; i++) {
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
