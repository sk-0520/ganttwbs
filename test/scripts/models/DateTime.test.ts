import { DateTime, Unit } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";

describe("DateTime", () => {

	test("parse", () => {
		const expected = DateTime.parse("2000-01-01T00:00:00", TimeZone.utc);
		for (let i = 0; i < 20; i++) {
			const offset = TimeSpan.fromHours(i);
			const actual = DateTime.parse("2000-01-01T00:00:00", TimeZone.create(offset));
			expect(actual.getTime() + offset.totalMilliseconds).toBe(expected.getTime());
		}
	});

	test("parse YYYY-MM-DD", () => {
		for (let i = 0; i < 20; i++) {
			const actual = DateTime.parse("2000-01-01", TimeZone.create(TimeSpan.fromHours(i)));
			expect(actual.hour).toEqual(0);
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
	])("add - TimeSpan", (expected: DateTime, date: DateTime, diff: TimeSpan) => {
		const actual = date.add(diff);
		expect(actual.getTime()).toEqual(expected.getTime());
	});

	test.each([
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 0, "year"],
		[DateTime.parse("2000-01-02T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "day"],
		[DateTime.parse("2000-02-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "month"],
		[DateTime.parse("2001-01-01T00:00:00", TimeZone.utc), DateTime.parse("2000-01-01T00:00:00", TimeZone.utc), 1, "year"],
		[DateTime.parse("2000-01-01T00:00:00", TimeZone.create("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.create("Asia/Tokyo")), 0, "year"],
		[DateTime.parse("2000-01-02T00:00:00", TimeZone.create("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.create("Asia/Tokyo")), 1, "day"],
		[DateTime.parse("2000-02-01T00:00:00", TimeZone.create("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.create("Asia/Tokyo")), 1, "month"],
		[DateTime.parse("2001-01-01T00:00:00", TimeZone.create("Asia/Tokyo")), DateTime.parse("2000-01-01T00:00:00", TimeZone.create("Asia/Tokyo")), 1, "year"],
	])("add - unit", (expected: DateTime, date: DateTime, diff: number, unit: string) => {
		const actual = date.add(diff, unit as Unit);
		expect(actual.getTime()).toEqual(expected.getTime());
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
