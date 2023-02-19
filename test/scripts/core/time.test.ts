import { TimeSpan, DateTime } from '../../../models/core/time';

describe('time', () => {
	describe('TimeSpan', () => {
		test('fromMilliseconds', () => {
			expect(TimeSpan.fromMilliseconds(0).ticks).toBe(0);
			expect(TimeSpan.fromMilliseconds(1_000).ticks).toBe(1_000);
		});

		test('fromSeconds', () => {
			expect(TimeSpan.fromSeconds(0).ticks).toBe(0);
			expect(TimeSpan.fromSeconds(1).ticks).toBe(1_000);
			expect(TimeSpan.fromSeconds(10).ticks).toBe(10_000);
		});

		test('fromSeconds', () => {
			expect(TimeSpan.fromMinutes(0).ticks).toBe(0);
			expect(TimeSpan.fromMinutes(1).ticks).toBe(60_000);
			expect(TimeSpan.fromMinutes(10).ticks).toBe(600_000);
		});

		test('fromHours', () => {
			expect(TimeSpan.fromHours(0).ticks).toBe(0);
			expect(TimeSpan.fromHours(1).ticks).toBe(3_600_000);
			expect(TimeSpan.fromHours(10).ticks).toBe(36_000_000);
		});

		test('fromDays', () => {
			expect(TimeSpan.fromDays(0).ticks).toBe(0);
			expect(TimeSpan.fromDays(1).ticks).toBe(86_400_000);
			expect(TimeSpan.fromDays(10).ticks).toBe(864_000_000);
		});

		test('totalMilliseconds', () => {
			expect(TimeSpan.fromMilliseconds(0).totalMilliseconds).toBe(0);
			expect(TimeSpan.fromMilliseconds(1_000).totalMilliseconds).toBe(1_000);
		});

		test('totalMilliseconds', () => {
			expect(TimeSpan.fromSeconds(0).totalSeconds).toBe(0);
			expect(TimeSpan.fromSeconds(1_000).totalSeconds).toBe(1_000);
		});

		test('totalMinutes', () => {
			expect(TimeSpan.fromMinutes(0).totalMinutes).toBe(0);
			expect(TimeSpan.fromMinutes(1_000).totalMinutes).toBe(1_000);
		});

		test('totalHours', () => {
			expect(TimeSpan.fromHours(0).totalHours).toBe(0);
			expect(TimeSpan.fromHours(1_000).totalHours).toBe(1_000);
		});

		test('totalDays', () => {
			expect(TimeSpan.fromDays(0).totalDays).toBe(0);
			expect(TimeSpan.fromDays(1_000).totalDays).toBe(1_000);
		});

		test('equals', () => {
			expect(TimeSpan.fromDays(0).equals(TimeSpan.fromDays(0))).toBeTruthy();
			expect(TimeSpan.fromMilliseconds(0).equals(TimeSpan.fromMilliseconds(1))).toBeFalsy();
		});

		test.each([
			[0, TimeSpan.fromMilliseconds(0), TimeSpan.fromMilliseconds(0)],
			[-1, TimeSpan.fromMilliseconds(0), TimeSpan.fromMilliseconds(1)],
			[+1, TimeSpan.fromMilliseconds(1), TimeSpan.fromMilliseconds(0)],
		])('compare', (expected, a, b) => {
			const actual = a.compare(b);
			if (actual < 0) {
				expect(expected).toBe(-1);
			} else if (0 < actual) {
				expect(expected).toBe(+1);
			} else {
				expect(expected).toBe(0);
			}
		});
	});

	//-----------------------------------

	describe('DateTime', () => {
		test.each([
			[2000, 1, 2, 0, 0, 0, 0, DateTime.create(2000, 1, 2)],
			[2000, 1, 2, 3, 0, 0, 0, DateTime.create(2000, 1, 2, 3)],
			[2000, 1, 2, 3, 4, 0, 0, DateTime.create(2000, 1, 2, 3, 4)],
			[2000, 1, 2, 3, 4, 5, 0, DateTime.create(2000, 1, 2, 3, 4, 5)],
			[2000, 1, 2, 3, 4, 5, 6, DateTime.create(2000, 1, 2, 3, 4, 5, 6)],
		])('create', (year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, expected: DateTime) => {
			expect(expected.isUtc).toBeFalsy();
			expect(expected.year).toBe(year);
			expect(expected.month).toBe(month);
			expect(expected.day).toBe(day);
			expect(expected.hour).toBe(hour);
			expect(expected.minute).toBe(minute);
			expect(expected.second).toBe(second);
			expect(expected.millisecond).toBe(millisecond);
		});

		test.each([
			[2000, 1, 2, 0, 0, 0, 0, DateTime.createUtc(2000, 1, 2)],
			[2000, 1, 2, 3, 0, 0, 0, DateTime.createUtc(2000, 1, 2, 3)],
			[2000, 1, 2, 3, 4, 0, 0, DateTime.createUtc(2000, 1, 2, 3, 4)],
			[2000, 1, 2, 3, 4, 5, 0, DateTime.createUtc(2000, 1, 2, 3, 4, 5)],
			[2000, 1, 2, 3, 4, 5, 6, DateTime.createUtc(2000, 1, 2, 3, 4, 5, 6)],
		])('createUtc', (year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, expected: DateTime) => {
			expect(expected.isUtc).toBeTruthy();
			expect(expected.year).toBe(year);
			expect(expected.month).toBe(month);
			expect(expected.day).toBe(day);
			expect(expected.hour).toBe(hour);
			expect(expected.minute).toBe(minute);
			expect(expected.second).toBe(second);
			expect(expected.millisecond).toBe(millisecond);
		});

		test('add', () => {
			expect(DateTime.createUtc(2000, 1, 2).add(TimeSpan.fromDays(1)).equals(DateTime.createUtc(2000, 1, 3))).toBeTruthy()
			expect(DateTime.createUtc(2000, 1, 2).add(TimeSpan.fromDays(-1)).equals(DateTime.createUtc(2000, 1, 1))).toBeTruthy()
			expect(DateTime.createUtc(2022, 2, 28).add(TimeSpan.fromDays(1)).equals(DateTime.createUtc(2022, 3, 1))).toBeTruthy()
			expect(DateTime.createUtc(2022, 3, 1).add(TimeSpan.fromDays(-1)).equals(DateTime.createUtc(2022, 2, 28))).toBeTruthy()
			expect(DateTime.createUtc(2024, 2, 28).add(TimeSpan.fromDays(1)).equals(DateTime.createUtc(2024, 2, 29))).toBeTruthy()
			expect(DateTime.createUtc(2024, 2, 29).add(TimeSpan.fromDays(0)).equals(DateTime.createUtc(2024, 2, 29))).toBeTruthy()
			expect(DateTime.createUtc(2024, 3, 1).add(TimeSpan.fromDays(-1)).equals(DateTime.createUtc(2024, 2, 29))).toBeTruthy()
			expect(DateTime.createUtc(2024, 2, 29).add(TimeSpan.fromDays(-1)).equals(DateTime.createUtc(2024, 2, 28))).toBeTruthy()
		});

		test.each([
			[0, DateTime.createUtc(2000, 1, 2), DateTime.createUtc(2000, 1, 2)],
			[-1, DateTime.createUtc(2000, 1, 2), DateTime.createUtc(2000, 1, 3)],
			[+1, DateTime.createUtc(2000, 1, 2), DateTime.createUtc(2000, 1, 1)],
		])('compare', (expected, a, b) => {
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
			['4321', 'yyyy'],
			['04321', 'yyyyy'],
			['1', 'M'],
			['01', 'MM'],
			['2', 'd'],
			['02', 'dd'],
			['3', 'H'],
			['03', 'HH'],
			['4', 'm'],
			['04', 'mm'],
			['5', 's'],
			['05', 'ss'],
			['43210102030405', 'yyyyMMddHHmmss'],
		])('toString', (expected, s) => {
			const dateTime = DateTime.createUtc(4321, 1, 2, 3, 4, 5, 6);
			const actual = dateTime.toString(s);
			expect(actual).toBe(expected);
		});
	});
});
