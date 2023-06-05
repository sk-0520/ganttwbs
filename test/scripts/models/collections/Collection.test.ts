import { Collection } from "@/models/collections/Collection";


describe("Collection", () => {
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

});
