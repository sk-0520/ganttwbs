import { Calendars } from "@/models/Calendars";
import { HolidayEventMap, HolidayRegulars } from "@/models/data/Calendar";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { DateTimeRange } from "@/models/data/Range";
import { DateTime } from "@/models/DateTime";
import { TimeZone } from "@/models/TimeZone";

const dummy: HolidayEventMapValue = {
	date: DateTime.today(TimeZone.utc),
	event: {
		kind: "normal",
		display: "",
	},
};

describe("Calendars", () => {
	test.each([
		[1, { begin: DateTime.parse("2023-05-17", TimeZone.utc), end: DateTime.parse("2023-05-17", TimeZone.utc) }],
		[2, { begin: DateTime.parse("2023-05-17", TimeZone.utc), end: DateTime.parse("2023-05-18", TimeZone.utc) }],
		[2, { begin: DateTime.parse("2023-05-17", TimeZone.utc), end: DateTime.parse("2023-05-18T23:59:59", TimeZone.utc) }],
	])("getCalendarRangeDays", (expected: number, range: DateTimeRange) => {
		expect(Calendars.getCalendarRangeDays(range)).toBe(expected);
	});

	test.each([
		[1, DateTime.parse("2023-05-17", TimeZone.utc), DateTime.parse("2023-05-17", TimeZone.utc)],
		[1, DateTime.parse("2023-05-17", TimeZone.utc), DateTime.parse("2023-05-18", TimeZone.utc)],
		[2, DateTime.parse("2023-05-17", TimeZone.utc), DateTime.parse("2023-05-18T00:00:01", TimeZone.utc)],
		[2, DateTime.parse("2023-05-17", TimeZone.utc), DateTime.parse("2023-05-18T23:59:59", TimeZone.utc)],
		[1, DateTime.parse("2023-05-19T23:59:59", TimeZone.utc), DateTime.parse("2023-05-19T23:59:59", TimeZone.utc)],
		[2, DateTime.parse("2023-03-07", TimeZone.utc), DateTime.parse("2023-03-08T12:00:00", TimeZone.utc)],
		[1, DateTime.parse("2023-03-07", TimeZone.utc), DateTime.parse("2023-03-07T12:00:00", TimeZone.utc)],
		[8, DateTime.parse("2023-03-08", TimeZone.utc), DateTime.parse("2023-03-15T06:00:00", TimeZone.utc)],
		[8, DateTime.parse("2023-03-08T12:00:00", TimeZone.utc), DateTime.parse("2023-03-15T06:00:00", TimeZone.utc)],
	])("getDays", (expected: number, begin: DateTime, end: DateTime) => {
		const actual = Calendars.getDays({ begin, end });
		expect(actual.length).toBe(expected);
		if (actual.length === 1) {
			expect(actual[0].ticks).toBe(begin.ticks);
		} else {
			expect(actual[0].ticks).toBe(begin.ticks);
			expect(actual[actual.length - 1].ticks).toBe(end.ticks);
		}
	});

	test.each([
		[1, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-05-01", TimeZone.utc)],
		[2, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-06-01", TimeZone.utc)],
		[2, DateTime.parse("2023-05-31", TimeZone.utc), DateTime.parse("2023-06-01", TimeZone.utc)],
		[3, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-07-01", TimeZone.utc)],
		[8, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-12-01", TimeZone.utc)],
		[9, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2024-01-01", TimeZone.utc)],
		[12, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2024-04-01", TimeZone.utc)],
		[13, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2024-05-01", TimeZone.utc)],
	])("getMonthCount", (expected: number, begin: DateTime, end: DateTime) => {
		expect(Calendars.getMonthCount(begin, end)).toBe(expected);
	});

	test.each([
		[1, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-05-01", TimeZone.utc)],
		[2, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-06-01", TimeZone.utc)],
		[2, DateTime.parse("2023-05-31", TimeZone.utc), DateTime.parse("2023-06-01", TimeZone.utc)],
		[3, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-07-01", TimeZone.utc)],
		[8, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2023-12-01", TimeZone.utc)],
		[9, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2024-01-01", TimeZone.utc)],
		[12, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2024-04-01", TimeZone.utc)],
		[13, DateTime.parse("2023-05-01", TimeZone.utc), DateTime.parse("2024-05-01", TimeZone.utc)],
	])("getMonths", (expected: number, begin: DateTime, end: DateTime) => {
		const actual = Calendars.getMonths(begin, end);
		expect(actual.length).toBe(expected);
		if (actual.length === 1) {
			expect(actual[0].ticks).toBe(begin.ticks);
		} else {
			expect(actual[0].ticks).toBe(begin.ticks);
			expect(actual[actual.length - 1].ticks).toBe(end.ticks);
		}
	});

	test.each([
		[DateTime.parse("2023-05-28", TimeZone.utc)],
		[DateTime.parse("2023-05-29", TimeZone.utc)],
		[DateTime.parse("2023-05-30", TimeZone.utc)],
		[DateTime.parse("2023-05-31", TimeZone.utc)],
		[DateTime.parse("2023-06-01", TimeZone.utc)],
		[DateTime.parse("2023-06-02", TimeZone.utc)],
		[DateTime.parse("2023-06-03", TimeZone.utc)],
		[DateTime.parse("2023-06-04", TimeZone.utc)],
		[DateTime.parse("2023-06-05", TimeZone.utc)],
		[DateTime.parse("2023-06-06", TimeZone.utc)],
		[DateTime.parse("2023-06-07", TimeZone.utc)],
		[DateTime.parse("2023-06-08", TimeZone.utc)],
		[DateTime.parse("2023-06-09", TimeZone.utc)],
		[DateTime.parse("2023-06-10", TimeZone.utc)],
	])("isHoliday - none", (date: DateTime) => {
		const regulars: HolidayRegulars = new Set();
		const events: HolidayEventMap = new Map();
		const actual = Calendars.isHoliday(date, regulars, events);
		expect(actual).toBeFalsy();
	});

	test.each([
		[true, DateTime.parse("2023-05-28", TimeZone.utc)],
		[false, DateTime.parse("2023-05-29", TimeZone.utc)],
		[false, DateTime.parse("2023-05-30", TimeZone.utc)],
		[false, DateTime.parse("2023-05-31", TimeZone.utc)],
		[false, DateTime.parse("2023-06-01", TimeZone.utc)],
		[false, DateTime.parse("2023-06-02", TimeZone.utc)],
		[true, DateTime.parse("2023-06-03", TimeZone.utc)],
		[true, DateTime.parse("2023-06-04", TimeZone.utc)],
		[false, DateTime.parse("2023-06-05", TimeZone.utc)],
		[false, DateTime.parse("2023-06-06", TimeZone.utc)],
		[false, DateTime.parse("2023-06-07", TimeZone.utc)],
		[false, DateTime.parse("2023-06-08", TimeZone.utc)],
		[false, DateTime.parse("2023-06-09", TimeZone.utc)],
		[true, DateTime.parse("2023-06-10", TimeZone.utc)],
	])("isHoliday - regulars", (expected: boolean, date: DateTime) => {
		const events: HolidayEventMap = new Map();
		const regulars: HolidayRegulars = new Set([
			0,
			6
		]);
		const actual = Calendars.isHoliday(date, regulars, events);
		expect(actual).toBe(expected);
	});

	test.each([
		[false, DateTime.parse("2023-05-28", TimeZone.utc)],
		[false, DateTime.parse("2023-05-29", TimeZone.utc)],
		[false, DateTime.parse("2023-05-30", TimeZone.utc)],
		[true, DateTime.parse("2023-05-31", TimeZone.utc)],
		[false, DateTime.parse("2023-06-01", TimeZone.utc)],
		[false, DateTime.parse("2023-06-02", TimeZone.utc)],
		[false, DateTime.parse("2023-06-03", TimeZone.utc)],
		[false, DateTime.parse("2023-06-04", TimeZone.utc)],
		[false, DateTime.parse("2023-06-05", TimeZone.utc)],
		[true, DateTime.parse("2023-06-06", TimeZone.utc)],
		[false, DateTime.parse("2023-06-07", TimeZone.utc)],
		[false, DateTime.parse("2023-06-08", TimeZone.utc)],
		[false, DateTime.parse("2023-06-09", TimeZone.utc)],
		[false, DateTime.parse("2023-06-10", TimeZone.utc)],
	])("isHoliday - event", (expected: boolean, date: DateTime) => {
		const regulars: HolidayRegulars = new Set();
		const events: HolidayEventMap = new Map([
			[DateTime.parse("2023-05-31", TimeZone.utc).ticks, dummy],
			[DateTime.parse("2023-06-06", TimeZone.utc).ticks, dummy],
		]);
		const actual = Calendars.isHoliday(date, regulars, events);
		expect(actual).toBe(expected);
	});

	test.each([
		[true, DateTime.parse("2023-05-28", TimeZone.utc)],
		[false, DateTime.parse("2023-05-29", TimeZone.utc)],
		[false, DateTime.parse("2023-05-30", TimeZone.utc)],
		[true, DateTime.parse("2023-05-31", TimeZone.utc)],
		[false, DateTime.parse("2023-06-01", TimeZone.utc)],
		[true, DateTime.parse("2023-06-02", TimeZone.utc)],
		[false, DateTime.parse("2023-06-03", TimeZone.utc)],
		[true, DateTime.parse("2023-06-04", TimeZone.utc)],
		[false, DateTime.parse("2023-06-05", TimeZone.utc)],
		[true, DateTime.parse("2023-06-06", TimeZone.utc)],
		[false, DateTime.parse("2023-06-07", TimeZone.utc)],
		[false, DateTime.parse("2023-06-08", TimeZone.utc)],
		[true, DateTime.parse("2023-06-09", TimeZone.utc)],
		[false, DateTime.parse("2023-06-10", TimeZone.utc)],
	])("isHoliday - regulars + event", (expected: boolean, date: DateTime) => {
		const regulars: HolidayRegulars = new Set([
			0,
			5
		]);
		const events: HolidayEventMap = new Map([
			[DateTime.parse("2023-05-31", TimeZone.utc).ticks, dummy],
			[DateTime.parse("2023-06-06", TimeZone.utc).ticks, dummy],
		]);

		const actual = Calendars.isHoliday(date, regulars, events);
		expect(actual).toBe(expected);
	});

	test("getWorkDays - regulars", () => {
		const expected = [
			//DateTime.parse("2023-05-28", TimeZone.utc),
			DateTime.parse("2023-05-29", TimeZone.utc),
			DateTime.parse("2023-05-30", TimeZone.utc),
			DateTime.parse("2023-05-31", TimeZone.utc),
			DateTime.parse("2023-06-01", TimeZone.utc),
			DateTime.parse("2023-06-02", TimeZone.utc),
			//DateTime.parse("2023-06-03", TimeZone.utc),
			//DateTime.parse("2023-06-04", TimeZone.utc),
			DateTime.parse("2023-06-05", TimeZone.utc),
			DateTime.parse("2023-06-06", TimeZone.utc),
			DateTime.parse("2023-06-07", TimeZone.utc),
			DateTime.parse("2023-06-08", TimeZone.utc),
			DateTime.parse("2023-06-09", TimeZone.utc),
			//DateTime.parse("2023-06-10", TimeZone.utc),
		];

		const range:DateTimeRange = {
			begin: DateTime.parse("2023-05-28", TimeZone.utc),
			end: DateTime.parse("2023-06-10T23:59:59", TimeZone.utc),
		};
		const regulars: HolidayRegulars = new Set([
			0,
			6
		]);
		const events: HolidayEventMap = new Map();
		const actual = Calendars.getWorkDays(range, regulars, events);
		expect(actual.length).toBe(expected.length);
		for (let i = 0; i < expected.length; i++) {
			expect(expected[i].equals(actual[i])).toBeTruthy();
		}

	});

	test("getWorkDays - event", () => {
		const expected = [
			DateTime.parse("2023-05-28", TimeZone.utc),
			DateTime.parse("2023-05-29", TimeZone.utc),
			DateTime.parse("2023-05-30", TimeZone.utc),
			//DateTime.parse("2023-05-31", TimeZone.utc),
			DateTime.parse("2023-06-01", TimeZone.utc),
			DateTime.parse("2023-06-02", TimeZone.utc),
			DateTime.parse("2023-06-03", TimeZone.utc),
			DateTime.parse("2023-06-04", TimeZone.utc),
			DateTime.parse("2023-06-05", TimeZone.utc),
			//DateTime.parse("2023-06-06", TimeZone.utc),
			DateTime.parse("2023-06-07", TimeZone.utc),
			DateTime.parse("2023-06-08", TimeZone.utc),
			DateTime.parse("2023-06-09", TimeZone.utc),
			DateTime.parse("2023-06-10", TimeZone.utc),
		];

		const range:DateTimeRange = {
			begin: DateTime.parse("2023-05-28", TimeZone.utc),
			end: DateTime.parse("2023-06-10T23:59:59", TimeZone.utc),
		};
		const regulars: HolidayRegulars = new Set();
		const events: HolidayEventMap = new Map([
			[DateTime.parse("2023-05-31", TimeZone.utc).ticks, dummy],
			[DateTime.parse("2023-06-06", TimeZone.utc).ticks, dummy],
		]);
		const actual = Calendars.getWorkDays(range, regulars, events);
		expect(actual.length).toBe(expected.length);
		for (let i = 0; i < expected.length; i++) {
			expect(expected[i].equals(actual[i].truncateTime())).toBeTruthy();
		}

	});


	test("getWorkDays - regulars + event", () => {
		const expected = [
			//DateTime.parse("2023-05-28", TimeZone.utc),
			DateTime.parse("2023-05-29", TimeZone.utc),
			DateTime.parse("2023-05-30", TimeZone.utc),
			//DateTime.parse("2023-05-31", TimeZone.utc),
			DateTime.parse("2023-06-01", TimeZone.utc),
			//DateTime.parse("2023-06-02", TimeZone.utc),
			DateTime.parse("2023-06-03", TimeZone.utc),
			//DateTime.parse("2023-06-04", TimeZone.utc),
			DateTime.parse("2023-06-05", TimeZone.utc),
			//DateTime.parse("2023-06-06", TimeZone.utc),
			DateTime.parse("2023-06-07", TimeZone.utc),
			DateTime.parse("2023-06-08", TimeZone.utc),
			//DateTime.parse("2023-06-09", TimeZone.utc),
			DateTime.parse("2023-06-10", TimeZone.utc),
		];

		const range:DateTimeRange = {
			begin: DateTime.parse("2023-05-28", TimeZone.utc),
			end: DateTime.parse("2023-06-10T23:59:59", TimeZone.utc),
		};
		const regulars: HolidayRegulars = new Set([
			0,
			5
		]);
		const events: HolidayEventMap = new Map([
			[DateTime.parse("2023-05-31", TimeZone.utc).ticks, dummy],
			[DateTime.parse("2023-06-06", TimeZone.utc).ticks, dummy],
		]);
		const actual = Calendars.getWorkDays(range, regulars, events);
		expect(actual.length).toBe(expected.length);
		for (let i = 0; i < expected.length; i++) {
			expect(expected[i].equals(actual[i].truncateTime())).toBeTruthy();
		}

	});
});
