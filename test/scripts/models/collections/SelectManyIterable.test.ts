import { SelectManyIterable } from "@/models/collections/SelectMany";

describe("SelectManyIterable.test", () => {
	test("selectMany", () => {
		const expected = ["[1]", "[2]", "[3]", "[4]", "[5]", "[6]"];
		const iterable = new SelectManyIterable(
			[[1, 2, 3], [4, 5, 6]],
			a => `[${a}]`
		);
		expect([...iterable]).toStrictEqual(expected);
	});

	test("selectMany - throw", () => {
		const iterable = new SelectManyIterable(
			[1, 2, 3 ,4, 5, 6] as unknown as Iterable<Iterable<number>>,
			a => `[${a}]`
		);
		expect(() => [...iterable]).toThrowError();
	});
});
