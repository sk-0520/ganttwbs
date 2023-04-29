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
		["", ""],
	])("replaceFunc - throw", (head: string, tail: string) => {
		expect(() => Strings.replaceFunc("", head, tail, s => s)).toThrowError();
	});

	test.each([
		["", "", "<", ">", (s: string) => `${s}`],
		["A", "<A>", "<", ">", (s: string) => `${s}`],
		["<A>", "<A>", "(", ")", (s: string) => `${s}`],
		["A", "(A)", "(", ")", (s: string) => `${s}`],
		["<A>", "(A)", "(", ")", (s: string) => `<${s}>`],
		["<A>-<B>-<C>", "(A)-(B)-<C>", "(", ")", (s: string) => `<${s}>`],
		["<A>\r<B>\n<C>", "(A)\r(B)\n<C>", "(", ")", (s: string) => `<${s}>`],
	])("replaceFunc", (expected: string, source: string, head: string, tail: string, func: (placeholder: string) => string) => {
		expect(Strings.replaceFunc(source, head, tail, func)).toBe(expected);
	});

	test.each([
		["ABC-abc-ABC", "ABC-abc-ABC", { "A": "[aa]" }, undefined, undefined],
		["[aa]BC-abc-[aa]BC", "${A}BC-abc-${A}BC", { "A": "[aa]" }, undefined, undefined],
		["[aa]BC-abc-[aa]BC", "${A}BC-abc-${A}BC", new Map([["A", "[aa]"]]), undefined, undefined],
		["ABC-abc-ABC", "ABC-${abc}-ABC", { "ABC": "" }, undefined, undefined],
	])("replaceMap", (expected: string, source: string, map: ReadonlyMap<string, string> | Record<string, string>, head: string | undefined, tail: string | undefined) => {
		expect(Strings.replaceMap(source, map, head, tail)).toBe(expected);
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

});

