import { CssHelper } from "@/models/CssHelper";

describe("CssHelper", () => {

	test.each([
		["", []],
		["a", ["a"]],
		["a b", ["a", "b"]],
	])("joinClassName", (expected: string, input: ReadonlyArray<string>) => {
		expect(CssHelper.joinClassName(input)).toBe(expected);
	});

	test.each([
		["", []],
		["a", ["a"]],
		["a,b", ["a", "b"]],
		["a,b,'c c'", ["a", "b", "c c"]],
	])("toFontFamily", (expected: string, input: ReadonlyArray<string>) => {
		expect(CssHelper.toFontFamily(input)).toBe(expected);
	});

});
