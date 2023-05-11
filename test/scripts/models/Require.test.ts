import { Require } from "@/models/Require";

describe("Require", () => {
	test.each([
		[10, 1, new Map([[1, 10], [2, 20], [3, 30]])],
		[20, "2", new Map([["1", 10], ["2", 20], ["3", 30]])],
		["C", "3", new Map([["1", "A"], ["2", "B"], ["3", "C"]])],
	])("get", <K, V>(expected: V, key: K, map: Map<K, V>) => {
		expect(Require.get(map, key)).toBe(expected);
	});

	test.each([
		[0, new Map([[1, 10]])],
		[1, new Map([[1, undefined]])],
	])("get - throw", <K, V>(key: K, map: Map<K, V>) => {
		expect(() => Require.get(map, key)).toThrow();
	});

	test.each([
		["A", "a"],
		["B", "b"],
		["C", "c"],
	])("switch", (expected: string, input: string) => {
		const actual = Require.switch(input, {
			"a": _ => "A",
			"b": _ => "B",
			"c": _ => "C",
		});
		expect(actual).toBe(expected);
	});

	test("switch - default", () => {
		const actual = Require.switch("X", {
			"a": _ => "A",
			"b": _ => "B",
			"c": _ => "C",
		}, "DEFAULT");
		expect(actual).toBe("DEFAULT");
	});

	test("switch - throw", () => {
		expect(() => Require.switch("X", {
			"a": _ => "A",
			"b": _ => "B",
			"c": _ => "C",
		})).toThrow();
	});
});
