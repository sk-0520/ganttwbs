import { Dates } from "../../../src/models/Dates";
import { TimeSpan } from "../../../src/models/TimeSpan";

describe("Dates", () => {

	test.each([
		[new Date("2000-01-01T00:00:00"), new Date("2000-01-01T00:00:00"), TimeSpan.zero],
		[new Date("2000-01-01T00:00:00.001"), new Date("2000-01-01T00:00:00"), TimeSpan.fromMilliseconds(1)],
		[new Date("1999-12-31T23:59:59.999"), new Date("2000-01-01T00:00:00"), TimeSpan.fromMilliseconds(-1)],
		[new Date("2000-01-01T00:00:01"), new Date("2000-01-01T00:00:00"), TimeSpan.fromSeconds(1)],
		[new Date("2000-01-01T00:01:00"), new Date("2000-01-01T00:00:00"), TimeSpan.fromMinutes(1)],
		[new Date("2000-01-01T01:00:00"), new Date("2000-01-01T00:00:00"), TimeSpan.fromHours(1)],
		[new Date("2000-01-02T00:00:00"), new Date("2000-01-01T00:00:00"), TimeSpan.fromDays(1)],
	])("add", (expected, date, time) => {
		expect(Dates.add(date, time)).toEqual(expected);
	});

	test.each([
		[TimeSpan.fromDays(1), new Date(2000, 6, 10), new Date(2000, 6, 9)],
		[TimeSpan.fromDays(2), new Date(2000, 6, 10), new Date(2000, 6, 8)],
		[TimeSpan.fromDays(-1), new Date(2000, 6, 9), new Date(2000, 6, 10)],
		[TimeSpan.fromDays(-2), new Date(2000, 6, 8), new Date(2000, 6, 10)],
	])("diff", (expected, a, b) => {
		const actual = Dates.diff(a, b);
		expect(expected.equals(actual)).toBeTruthy();
	});

	test.each([
		[new Date("2000-01-01T00:00:00"), "2000-01-01T00:00:00"],
		[new Date("3000-01-01T00:00:00"), "3000-01-01T00:00:00"],
		[null, "yyyy-MM-ddThh:mm:ss"],
	])("parse", (expected: Date | null, input) => {
		expect(Dates.parseDate(input)).toEqual(expected);
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
		const date = new Date(4321, 1 - 1, 2, 3, 4, 5, 6);
		const actual = Dates.format(date, s);
		expect(actual).toBe(expected);
	});

});
