import { DateTime, Unit } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";

describe("DateTime", () => {

	test.each([
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.create(TimeZone.utc, 2000, 1, 1, 0, 0, 0, 0)],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.create(TimeZone.parse("Asia/Tokyo"), 2000, 1, 1, 0, 0, 0, 0)],
	])("create", (expected: DateTime, actual: DateTime) => {
		expect(actual.format("U")).toBe(expected.format("U"));
		expect(actual.ticks).toBe(expected.ticks);
	});

	test("parse", () => {
		const expected = DateTime.parse("2000-01-01T00:00:00", TimeZone.utc);
		for (let i = 0; i < 20; i++) {
			const offset = TimeSpan.fromHours(i);
			const actual = DateTime.parse("2000-01-01T00:00:00", TimeZone.create(offset));
			expect(actual.ticks + offset.totalMilliseconds).toBe(expected.ticks);
		}
	});

	test.each([
		["", TimeZone.utc],
	])("parse - throw", (input: string, timeZone: TimeZone) => {
		expect(() => DateTime.parse(input, timeZone)).toThrowError();
	});

	test("parse YYYY-MM-DD", () => {
		for (let i = 0; i < 20; i++) {
			const actual = DateTime.parse("2000-01-01", TimeZone.create(TimeSpan.fromHours(i)));
			expect(actual.hour).toBe(0);
		}
	});

	test.each([
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.zero],
		[DateTime.parse("2000-01-01T00:00:00.001", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromMilliseconds(1)],
		[DateTime.parse("1999-12-31T23:59:59.999", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromMilliseconds(-1)],
		[DateTime.parse("2000-01-01T00:00:01", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromSeconds(1)],
		[DateTime.parse("2000-01-01T00:01:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromMinutes(1)],
		[DateTime.parse("2000-01-01T01:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromHours(1)],
		[DateTime.parse("2000-01-02T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromDays(1)],
		[DateTime.parse("2000-01-31T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromDays(30)],
		[DateTime.parse("2000-02-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromDays(31)],
		[DateTime.parse("2001-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeSpan.fromDays(366)],

		[DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.zero],
		[DateTime.parse("2000-01-01T00:00:00.001", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromMilliseconds(1)],
		[DateTime.parse("1999-12-31T23:59:59.999", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromMilliseconds(-1)],
		[DateTime.parse("2000-01-01T00:00:01", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromSeconds(1)],
		[DateTime.parse("2000-01-01T00:01:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromMinutes(1)],
		[DateTime.parse("2000-01-01T01:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromHours(1)],
		[DateTime.parse("2000-01-02T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromDays(1)],
		[DateTime.parse("2000-01-31T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromDays(30)],
		[DateTime.parse("2000-02-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromDays(31)],
		[DateTime.parse("2001-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), TimeSpan.fromDays(366)],
	])("add - TimeSpan", (expected: DateTime, date: DateTime, diff: TimeSpan) => {
		const actual = date.add(diff);
		expect(actual.timeZone.serialize()).toBe(date.timeZone.serialize());
		expect(actual.format("U")).toBe(expected.format("U"));
		expect(actual.ticks).toBe(expected.ticks);
	});

	test.each([
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 0, "year"],
		[DateTime.parse("2000-01-02T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "day"],
		[DateTime.parse("2000-01-08T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "week"],
		[DateTime.parse("2000-02-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "month"],
		[DateTime.parse("2001-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "year"],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), 0, "year"],
		[DateTime.parse("2000-01-02T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), 1, "day"],
		[DateTime.parse("2000-01-08T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), 1, "week"],
		[DateTime.parse("2000-02-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), 1, "month"],
		[DateTime.parse("2001-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), 1, "year"],
	])("add - unit", (expected: DateTime, date: DateTime, diff: number, unit: string) => {
		const actual = date.add(diff, unit as Unit);
		expect(actual.timeZone.serialize()).toBe(date.timeZone.serialize());
		expect(actual.ticks).toBe(expected.ticks);
	});

	test.each([
		[TimeSpan.fromDays(-1), DateTime.parse("2000-06-10", TimeZone.utc), DateTime.parse("2000-06-09", TimeZone.utc)],
		[TimeSpan.fromDays(-2), DateTime.parse("2000-06-10", TimeZone.utc), DateTime.parse("2000-06-08", TimeZone.utc)],
		[TimeSpan.fromDays(1), DateTime.parse("2000-06-09", TimeZone.utc), DateTime.parse("2000-06-10", TimeZone.utc)],
		[TimeSpan.fromDays(2), DateTime.parse("2000-06-08", TimeZone.utc), DateTime.parse("2000-06-10", TimeZone.utc)],
	])("diff", (expected, a, b) => {
		const actual = a.diff(b);
		expect(expected.equals(actual)).toBeTruthy();
	});

	test.each([
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), TimeZone.utc],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T09:00:00", TimeZone.parse("Asia/Tokyo")), TimeZone.utc],
	])("changeTimeZone", (expected: DateTime, source: DateTime, targetTimeZone: TimeZone) => {
		const actual = source.changeTimeZone(targetTimeZone);
		expect(actual.timeZone.serialize()).toBe(expected.timeZone.serialize());
		expect(actual.ticks).toBe(expected.ticks);
	});

	test.each([
		[true, 2000],
		[false, 2003],
		[true, 2004],
		[false, 2200],
		[true, 2204],
	])("isLeapYear", (expected: boolean, year: number) => {
		expect(DateTime.isLeapYear(year)).toBe(expected);
	});

	test.each([
		[DateTime.parse("2019-02-28T00:00:00", TimeZone.utc), DateTime.parse("2019-02-01T12:34:56.789", TimeZone.utc)],
		[DateTime.parse("2020-02-29T00:00:00", TimeZone.utc), DateTime.parse("2020-02-01T12:34:56.789", TimeZone.utc)],
		[DateTime.parse("2019-02-28T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2019-02-01T12:34:56.789", TimeZone.parse("Asia/Tokyo"))],
		[DateTime.parse("2020-02-29T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2020-02-01T12:34:56.789", TimeZone.parse("Asia/Tokyo"))],
	])("getLastDayOfMonth", (expected: DateTime, input: DateTime) => {
		const actual = input.getLastDayOfMonth();
		expect(actual.format("U")).toBe(expected.format("U"));
		expect(actual.ticks).toBe(expected.ticks);
	});

	test.each([
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc)],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T01:02:03", TimeZone.utc)],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo"))],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-01-01T01:02:03", TimeZone.parse("Asia/Tokyo"))],
		[DateTime.parse("2000-02-03T00:00:00", TimeZone.parse("Asia/Tokyo")), DateTime.parse("2000-02-03T23:59:59", TimeZone.parse("Asia/Tokyo"))],
	])("toDateOnly", (expected, input) => {
		const actual = input.toDateOnly();
		expect(actual.timeZone.serialize()).toBe(input.timeZone.serialize());
		expect(actual.ticks).toBe(expected.ticks);
	});

	test.each([
		["4321", "yyyy"],
		["04321", "yyyyy"],
		["1", "M"],
		["01", "MM"],
		["2", "d"],
		["02", "dd"],
		["3", "H"],
		["03", "HH"],
		["4", "m"],
		["04", "mm"],
		["5", "s"],
		["05", "ss"],
		["43210102030405", "yyyyMMddHHmmss"],
	])("format", (expected, s) => {
		const date = DateTime.parse("4321-01-02T03:04:05.6", TimeZone.utc);
		const actual = date.format(s);
		expect(actual).toBe(expected);
	});
});
