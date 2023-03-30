import { Strings } from "../../../src/models/Strings";

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

	test.each([
		["4321", "yyyy"],
		["04321", "yyyyy"],
		["1", "M"],
		["01", "MM"],
		["2", "d"],
		["02", "dd"],
		["3", "H"],
		["03", "HH"],
		["4", "m"],
		["04", "mm"],
		["5", "s"],
		["05", "ss"],
		["43210102030405", "yyyyMMddHHmmss"],
	])("formatTimestamp", (expected, s) => {
		const date = new Date(4321, 1 - 1, 2, 3, 4, 5, 6);
		const actual = Strings.formatDate(date, s);
		expect(actual).toBe(expected);
	});
});

