import { Arrays } from "../../../src/models/Arrays";

describe("Arrays", () => {
	test.each([
		[[1, 1, 1], 1, 3],
		[["A", "A", "A"], "A", 3],
	])("repeat", (expected, value, count: number) => {
		expect(Arrays.repeat(value, count)).toEqual(expected);
	});

	test.each([
		[0],
		[-1],
	])("repeat - throw", (count: number) => {
		expect(() => Arrays.repeat(0, count)).toThrowError(RangeError);
	});

	test.each([
		[0, 0],
		[3, 3],
		[2, 2],
	])("create", (expected, count: number) => {
		expect(Arrays.create(count).length).toEqual(expected);
	});

	test.each([
		[-1],
	])("create - throw", (count: number) => {
		expect(() => Arrays.create(count)).toThrowError(RangeError);
	});

	test.each([
		[[1, 2, 3], 1, 3],
		[[0, 1, 2], 0, 3],
		[[-1, 0, 1], -1, 3],
	])("range", (expected, start: number, count: number) => {
		expect(Arrays.range(start, count)).toEqual(expected);
	});

	test.each([
		[0],
		[-1],
	])("range - throw", (count: number) => {
		expect(() => Arrays.range(0, count)).toThrowError(RangeError);
	});

	test("first", () => {
		const input = [1, 2, 3];
		expect(Arrays.first(input)).toBe(1);
	});

	test("first - throw", () => {
		const input: Array<number> = [];
		expect(() => Arrays.first(input)).toThrowError(RangeError);
	});

	test("last", () => {
		const input = [1, 2, 3];
		expect(Arrays.last(input)).toBe(3);
	});

	test("last - throw", () => {
		const input: Array<number> = [];
		expect(() => Arrays.first(input)).toThrowError(RangeError);
	});
});
