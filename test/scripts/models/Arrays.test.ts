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
});
