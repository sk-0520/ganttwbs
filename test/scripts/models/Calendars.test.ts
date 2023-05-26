import { Calendars } from "@/models/Calendars";
import { DateTimeRange } from "@/models/data/Range";
import { DateTime } from "@/models/DateTime";
import { TimeZone } from "@/models/TimeZone";

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

});
