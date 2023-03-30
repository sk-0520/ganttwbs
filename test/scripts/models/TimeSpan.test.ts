import { TimeSpan } from "../../../src/models/TimeSpan";


describe("TimeSpan", () => {
	test("fromMilliseconds", () => {
		expect(TimeSpan.fromMilliseconds(0).ticks).toBe(0);
		expect(TimeSpan.fromMilliseconds(1_000).ticks).toBe(1_000);
	});

	test("fromSeconds", () => {
		expect(TimeSpan.fromSeconds(0).ticks).toBe(0);
		expect(TimeSpan.fromSeconds(1).ticks).toBe(1_000);
		expect(TimeSpan.fromSeconds(10).ticks).toBe(10_000);
	});

	test("fromSeconds", () => {
		expect(TimeSpan.fromMinutes(0).ticks).toBe(0);
		expect(TimeSpan.fromMinutes(1).ticks).toBe(60_000);
		expect(TimeSpan.fromMinutes(10).ticks).toBe(600_000);
	});

	test("fromHours", () => {
		expect(TimeSpan.fromHours(0).ticks).toBe(0);
		expect(TimeSpan.fromHours(1).ticks).toBe(3_600_000);
		expect(TimeSpan.fromHours(10).ticks).toBe(36_000_000);
	});

	test("fromDays", () => {
		expect(TimeSpan.fromDays(0).ticks).toBe(0);
		expect(TimeSpan.fromDays(1).ticks).toBe(86_400_000);
		expect(TimeSpan.fromDays(10).ticks).toBe(864_000_000);
	});

	test("milliseconds", () => {
		expect(TimeSpan.fromMilliseconds(0).milliseconds).toBe(0);
		expect(TimeSpan.fromMilliseconds(1_500).milliseconds).toBe(500);
		expect(TimeSpan.fromMilliseconds(10_125).milliseconds).toBe(125);
	});

	test("seconds", () => {
		expect(TimeSpan.fromSeconds(0).seconds).toBe(0);
		expect(TimeSpan.fromSeconds(15).seconds).toBe(15);
		expect(TimeSpan.fromSeconds(60).seconds).toBe(0);
		expect(TimeSpan.fromSeconds(61).seconds).toBe(1);
	});

	test("minutes", () => {
		expect(TimeSpan.fromMinutes(0).minutes).toBe(0);
		expect(TimeSpan.fromMinutes(15).minutes).toBe(15);
		expect(TimeSpan.fromMinutes(60).minutes).toBe(0);
		expect(TimeSpan.fromMinutes(61).minutes).toBe(1);
	});

	test("hours", () => {
		expect(TimeSpan.fromHours(0).hours).toBe(0);
		expect(TimeSpan.fromHours(13).hours).toBe(13);
		expect(TimeSpan.fromHours(24).hours).toBe(0);
		expect(TimeSpan.fromHours(25).hours).toBe(1);
	});

	test("days", () => {
		expect(TimeSpan.fromDays(0).days).toBe(0);
		expect(TimeSpan.fromDays(13).days).toBe(13);
		expect(TimeSpan.fromDays(365).days).toBe(365);
		expect(TimeSpan.fromDays(366).days).toBe(366);
	});

	test("totalMilliseconds", () => {
		expect(TimeSpan.fromMilliseconds(0).totalMilliseconds).toBe(0);
		expect(TimeSpan.fromMilliseconds(1_000).totalMilliseconds).toBe(1_000);
	});

	test("totalMilliseconds", () => {
		expect(TimeSpan.fromSeconds(0).totalSeconds).toBe(0);
		expect(TimeSpan.fromSeconds(1_000).totalSeconds).toBe(1_000);
	});

	test("totalMinutes", () => {
		expect(TimeSpan.fromMinutes(0).totalMinutes).toBe(0);
		expect(TimeSpan.fromMinutes(1_000).totalMinutes).toBe(1_000);
	});

	test("totalHours", () => {
		expect(TimeSpan.fromHours(0).totalHours).toBe(0);
		expect(TimeSpan.fromHours(1_000).totalHours).toBe(1_000);
	});

	test("totalDays", () => {
		expect(TimeSpan.fromDays(0).totalDays).toBe(0);
		expect(TimeSpan.fromDays(1_000).totalDays).toBe(1_000);
	});

	test("equals", () => {
		expect(TimeSpan.fromDays(0).equals(TimeSpan.fromDays(0))).toBeTruthy();
		expect(TimeSpan.fromMilliseconds(0).equals(TimeSpan.fromMilliseconds(1))).toBeFalsy();
	});

	test.each([
		[0, TimeSpan.fromMilliseconds(0), TimeSpan.fromMilliseconds(0)],
		[-1, TimeSpan.fromMilliseconds(0), TimeSpan.fromMilliseconds(1)],
		[+1, TimeSpan.fromMilliseconds(1), TimeSpan.fromMilliseconds(0)],
	])("compare", (expected, a, b) => {
		const actual = a.compare(b);
		if (actual < 0) {
			expect(expected).toBe(-1);
		} else if (0 < actual) {
			expect(expected).toBe(+1);
		} else {
			expect(expected).toBe(0);
		}
	});

	test.each([
		["00:00:00"],
		["00:00:00.0"],
		["0.00:00:00"],
		["0.00:00:00.0"],
		["1.23:34:45.678"],
		["365.23:34:45.001"],
		["365.23:34:45.1"],
	])("parse-readable", (input) => {
		const actual = TimeSpan.parse(input);
		const s1 = actual.toString("readable");
		const dup = TimeSpan.parse(s1);
		const s2 = dup.toString("readable");
		expect(s1).toBe(s2);
	});
});
