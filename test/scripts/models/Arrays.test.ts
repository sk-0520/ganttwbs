import { Arrays } from "@/models/Arrays";

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

	test.each([
		[[20, 10, 30], [10, 20, 30], 0, 1],
		[[20, 10, 30], [10, 20, 30], 1, 0],
		[[20, 30, 10], [10, 20, 30], 0, 2],
		[[30, 10, 20], [10, 20, 30], 2, 0],
	])("moveIndexInPlace", (expected: Array<unknown>, array: Array<unknown>, sourceIndex: number, destinationIndex: number) => {
		const actual = Arrays.moveIndexInPlace(array, sourceIndex, destinationIndex);
		expect(actual).toBe(array);
		expect(actual).toEqual(expected);
	});

	test.each([
		[[20, 10, 30], [10, 20, 30], 0, 1],
		[[20, 10, 30], [10, 20, 30], 1, 0],
		[[30, 20, 10], [10, 20, 30], 0, 2],
	])("replaceIndexInPlace", (expected: Array<unknown>, array: Array<unknown>, sourceIndex: number, destinationIndex: number) => {
		const actual = Arrays.replaceIndexInPlace(array, sourceIndex, destinationIndex);
		expect(actual).toBe(array);
		expect(actual).toEqual(expected);
	});

	test.each([
		[true, [20, 10, 30], [10, 20, 30], false, 20],
		[true, [10, 30, 20], [10, 20, 30], true, 20],
	])("replaceOrderInPlace", (expectedResult: boolean, expectedArray: Array<number>, array: Array<number>, toPrev: boolean, element: number) => {
		const actual = Arrays.replaceOrderInPlace(array, toPrev, element);
		expect(actual).toBe(expectedResult);
		expect(array).toEqual(expectedArray);
	});
});
