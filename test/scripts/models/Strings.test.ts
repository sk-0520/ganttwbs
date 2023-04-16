import { Strings } from "@/models/Strings";

describe("String", () => {
	test.each([
		[false, undefined],
		[false, null],
		[false, ""],
		[false, " "],
		[false, "　"],
		[true, "a"],
		[false, "\r"],
		[false, "\r\n"],
		[false, " \r\n \r\n "],
	])("isNotWhiteSpace", (expected: boolean, input: string | null | undefined) => {
		expect(Strings.isNotWhiteSpace(input)).toBe(expected);
	});

	test.each([
		["", "", []],
		["", "", [""]],
		["", " ", [" "]],
		["a ", " a ", [" "]],
		["a", "   a", [" "]],
		["　  a", "  　  a", [" "]],
		["a", "  　  a", [" ", "　"]],
	])("trimStart", (expected: string, input: string, characters: string[]) => {
		expect(Strings.trimStart(input, new Set(characters))).toBe(expected);
	});

	test.each([
		["", "", []],
		["", "", [""]],
		["", " ", [" "]],
		[" a", " a ", [" "]],
		[" a 　", " a 　 ", [" "]],
		[" a", " a  　  ", [" ", "　"]],
	])("trimEnd", (expected: string, input: string, characters: string[]) => {
		expect(Strings.trimEnd(input, new Set(characters))).toBe(expected);
	});

	describe("regex", () => {
		test.each([
			["\\*", "*"],
			["\\.", "."],
			["\\*\\*", "**"],
		])("escape", (expected: string, pattern: string) => {
			expect(Strings.escapeRegex(pattern)).toBe(expected);
		});
	});

	test.each([
		["", "", []],
		["", "", [""]],
		["a", " a ", [" "]],
		["　 a 　", " 　 a 　 ", [" "]],
		["a", " 　 a 　 ", [" ", "　"]],
	])("trim", (expected: string, input: string, characters: string[]) => {
		expect(Strings.trim(input, new Set(characters))).toBe(expected);
	});

	test.each([
		["", ""],
		["", " "],
		["a", " a "],
		["a", " 　 a 　 "],
		["a", " 　 a 　 "],
	])("trim:default", (expected: string, input: string) => {
		expect(Strings.trim(input)).toBe(expected);
	});

	test("replaceAllImpl", () => {
		expect(Strings.replaceAllImpl("abcabcABCABC", "a", "-")).toBe("-bc-bcABCABC");
		expect(Strings.replaceAllImpl("abcabcABCABC", /a/, "-")).toBe("-bc-bcABCABC");
		expect(Strings.replaceAllImpl("abcabcABCABC", /a/i, "-")).toBe("-bc-bc-BC-BC");
		expect(Strings.replaceAllImpl("abcabcABCABC", /a/g, "-")).toBe("-bc-bcABCABC");
		expect(Strings.replaceAllImpl("abcabcABCABC", /a/gi, "-")).toBe("-bc-bc-BC-BC");
	});

	test.each([
		[[], null],
		[[], undefined],
		[[], ""],
		[["a"], "a"],
		[["a", "b"], "a\r\nb"],
		[["a", "b"], "a\rb"],
		[["a", "b"], "a\nb"],
		[["", ""], "\r\n"],
		[["", ""], "\n"],
		[["", ""], "\r"],
		[["a", "b", "c"], "a\rb\nc"],
	])("splitLines", (expected: Array<string>, input: string | null | undefined) => {
		const actual = Strings.splitLines(input);
		expect(actual).toEqual(expected);
	});

	test.each([
		[false, null],
		[false, undefined],
		[false, ""],
		[false, "t"],
		[false, "on"],
		[false, "yes"],
		[true, "true"],
		[true, "True"],
		[true, "TRUE"],
	])("toBoolean", (expected: boolean, input: string | null | undefined) => {
		expect(Strings.toBoolean(input)).toBe(expected);
	});

});

