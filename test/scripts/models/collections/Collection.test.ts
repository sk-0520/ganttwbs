import { Collection } from "@/models/collections/Collection";
import { Predicate } from "@/models/collections/Iterator";

describe("Collection", () => {
	describe("生成", () => {
		test.each([
			[[0, 1, 2], 0, 3],
			[[10, 11, 12], 10, 3],
			[[-3, -2, -1], -3, 3],
		])("range", (expected: Array<number>, start: number, count: number) => {
			const collection = Collection.range(start, count);
			expect(collection.toArray()).toStrictEqual(expected);
			expect(collection.toArray()).toStrictEqual(expected);
		});

		test.each([
			[[0, 0, 0], 0, 3],
			[["A", "A", "A"], "A", 3],
		])("repeat", (expected, value, count: number) => {
			const collection = Collection.repeat(value, count);
			expect(collection.toArray()).toStrictEqual(expected);
			expect(collection.toArray()).toStrictEqual(expected);
		});

		test("empty", () => {
			expect(Collection.empty().toArray()).toStrictEqual([]);
			for (const _ of Collection.empty()) {
				fail();
			}
		});
	});

	describe("遅延", () => {
		test.each([
			[[1, 3, 5], [0, 1, 2, 3, 4, 5], (a: number) => a % 2 !== 0],
			[[0, 2, 4], [0, 1, 2, 3, 4, 5], (a: number) => a % 2 === 0],
		])("where", (expected, init, predicate) => {
			const collection = Collection.from(init);
			expect(collection.where(predicate).toArray()).toStrictEqual(expected);
			expect(collection.where(predicate).toArray()).toStrictEqual(expected);
		});

		test("select - source", () => {
			const collection = Collection.from([0, 1, 2, 3, 4, 5]);
			expect(collection.select(a => a * a).toArray()).toStrictEqual([0, 1, 4, 9, 16, 25]);
			expect(collection.select(a => a * a).toArray()).toStrictEqual([0, 1, 4, 9, 16, 25]);
		});

		test("select - index", () => {
			const collection = Collection.from(["A", "B", "C"]);
			expect(collection.select((a, i) => i).toArray()).toStrictEqual([0, 1, 2]);
			expect(collection.select((a, i) => i).toArray()).toStrictEqual([0, 1, 2]);
		});

		test("select - where", () => {
			const collection = Collection.from(["A", "B", "C", "D"]);
			const actual1 = collection
				.select((a, i) => i)
				.where(a => a % 2 !== 0)
				.select(a => String.fromCharCode(65 + a))
				.toArray()
				;
			expect(actual1).toStrictEqual(["B", "D"]);

			const actual2 = collection
				.select((a, i) => i)
				.where(a => a % 2 === 0)
				.select(a => String.fromCharCode(65 + a))
				.toArray()
				;
			expect(actual2).toStrictEqual(["A", "C"]);
		});

		test("selectMany", () => {
			const collection = Collection.from([[1, 2, 3], [4, 5, 6]]);
			const actual = collection.selectMany(a => `[${a}]`).toArray();
			expect(actual).toStrictEqual(["[1]", "[2]", "[3]", "[4]", "[5]", "[6]"]);
			expect(actual).toStrictEqual(["[1]", "[2]", "[3]", "[4]", "[5]", "[6]"]);
		});

		test("selectMany - throw", () => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(() => collection.selectMany(a => `[${a}]`).toArray()).toThrowError();
		});

		test("concat", () => {
			const expected1 = [10, 20, 30, -10, -20, -30];
			const expected2 = [10, 20, 30, -10, -20, -30, 1, 3, 5];
			const expected3 = [10, 20, 30, -10, -20, -30, 1, 3, 5, 2, 4, 6];

			const input1 = [10, 20, 30];
			const input2 = [-10, -20, -30];
			const input3 = Collection.from([1, 3, 5]);
			const input4 = [2, 4, 6];

			const actual1 = Collection.from(input1)
				.concat(input2)
				;
			const actual2 = actual1
				.concat(input3)
				;
			const actual3 = actual2
				.concat(input4)
				;
			const actualAll = Collection.from(input1)
				.concat(input2)
				.concat(input3)
				.concat(input4)
				;

			expect(actual1.toArray()).toStrictEqual(expected1);
			expect(actual2.toArray()).toStrictEqual(expected2);
			expect(actual3.toArray()).toStrictEqual(expected3);
			expect(actualAll.toArray()).toStrictEqual(expected3);

			expect(actual1.toArray()).toStrictEqual(expected1);
			expect(actual2.toArray()).toStrictEqual(expected2);
			expect(actual3.toArray()).toStrictEqual(expected3);
			expect(actualAll.toArray()).toStrictEqual(expected3);
		});

		test("prepend", () => {
			const collection = Collection.from([0, 1]);
			expect(collection.prepend(2).toArray()).toStrictEqual([2, 0, 1]);
			expect(collection.prepend(2).prepend(3).toArray()).toStrictEqual([3, 2, 0, 1]);
		});

		test("append", () => {
			const collection = Collection.from([0, 1]);
			expect(collection.append(2).toArray()).toStrictEqual([0, 1, 2]);
			expect(collection.append(2).append(3).toArray()).toStrictEqual([0, 1, 2, 3]);
		});

		test.each([
			[[0, 1, 2], 0],
			[[1, 2], 1],
			[[2], 2],
			[[], 3],
			[[], 4],
		])("skip", (expected: Array<number>, count: number) => {
			const collection = Collection.range(0, 3);
			expect(collection.skip(count).toArray()).toStrictEqual(expected);
		});
	});

	describe("即時", () => {
		test.each([
			[true, undefined],
			[true, (a: number) => 6 <= a],
			[false, (a: number) => 6 < a],
		])("any", (expected: boolean, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.any(predicate)).toBe(expected);
		});

		test("any - empty", () => {
			const collection = Collection.empty();
			expect(collection.any()).toBeFalsy();
		});

		test.each([
			[true, undefined],
			[true, (a: number) => a <= 6],
			[false, (a: number) => a < 6],
		])("all", (expected: boolean, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.all(predicate)).toBe(expected);
		});

		test("all - empty", () => {
			const collection = Collection.empty();
			expect(collection.all()).toBeTruthy();
		});

		test.each([
			[6, undefined],
			[3, (a: number) => a % 2 === 0],
		])("count", (expected: number, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.count(predicate)).toBe(expected);
		});

		test.each([
			[1, undefined],
			[5, (a: number) => 4 < a],
		])("first", (expected: number, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.first(predicate)).toBe(expected);
		});

		test("first - throw", () => {
			expect(() => Collection.empty().first()).toThrow(RangeError);
		});

		test.each([
			[1, undefined],
			[5, (a: number) => 4 < a],
			[undefined, (a: number) => 6 < a],
		])("firstOrUndefined", (expected: number | undefined, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.firstOrUndefined(predicate)).toBe(expected);
		});

		test.each([
			[6, undefined],
			[3, (a: number) => a < 4],
		])("last", (expected: number, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.last(predicate)).toBe(expected);
		});

		test("last - throw", () => {
			expect(() => Collection.empty().last()).toThrow(RangeError);
		});

		test.each([
			[6, undefined],
			[3, (a: number) => a < 4],
			[undefined, (a: number) => a < 0],
		])("lastOrUndefined", (expected: number | undefined, predicate?: Predicate<number>) => {
			const collection = Collection.from([1, 2, 3, 4, 5, 6]);
			expect(collection.lastOrUndefined(predicate)).toBe(expected);
		});

		describe("single", () => {
			test("empty - throw", () => {
				expect(() => Collection.empty().single()).toThrow(RangeError);
			});

			test("1 - 1", () => {
				expect(Collection.from([1]).single()).toBe(1);
			});

			test("3 - throw", () => {
				expect(() => Collection.from([1, 2, 3]).single()).toThrow(RangeError);
			});


			test("predicate - empty - throw", () => {
				expect(() => Collection.empty().single(a => a === 2)).toThrow(RangeError);
			});

			test("predicate - 3 - 1", () => {
				expect(Collection.from([0, 1, 2, 2]).single(a => a === 1)).toBe(1);
			});

			test("predicate - 4 - throw", () => {
				expect(() => Collection.from([0, 1, 2, 2]).single(a => a === 2)).toThrow(RangeError);
			});
		});

		describe("singleOrUndefined", () => {
			test("empty", () => {
				expect(Collection.empty().singleOrUndefined()).toBeUndefined();
			});

			test("1 - 1", () => {
				expect(Collection.from([1]).singleOrUndefined()).toBe(1);
			});

			test("3 - throw", () => {
				expect(() => Collection.from([1, 2, 3]).singleOrUndefined()).toThrow(RangeError);
			});

			test("predicate - empty", () => {
				expect(Collection.empty().singleOrUndefined(a => a === 2)).toBeUndefined();
			});

			test("predicate - 3 - 1", () => {
				expect(Collection.from([0, 1, 2, 2]).singleOrUndefined(a => a === 1)).toBe(1);
			});

			test("predicate - 4 - throw", () => {
				expect(() => Collection.from([0, 1, 2, 2]).singleOrUndefined(a => a === 2)).toThrow(RangeError);
			});
		});
	});
});
