import * as string from '../../../models/core/string';

describe('string', () => {
	test.each([
		[false, undefined],
		[false, null],
		[true, ''],
		[false, ' '],
		[false, '　'],
		[false, 'a'],
	])('isEmpty', (expected: boolean, input: string | null | undefined) => {
		expect(string.isEmpty(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, ''],
		[false, ' '],
		[false, '　'],
		[true, 'a'],
		[false, "\r"],
		[false, "\r\n"],
		[false, " \r\n \r\n "],
	])('isNotWhiteSpace', (expected: boolean, input: string | null | undefined) => {
		expect(string.isNotWhiteSpace(input)).toBe(expected);
	});

	test.each([
		['', '', []],
		['', '', ['']],
		['', ' ', [' ']],
		['a ', ' a ', [' ']],
		['a', '   a', [' ']],
		['　  a', '  　  a', [' ']],
		['a', '  　  a', [' ', '　']],
	])('trimStart', (expected: string, input: string, characters: string[]) => {
		expect(string.trimStart(input, new Set(characters))).toBe(expected);
	});

	test.each([
		['', '', []],
		['', '', ['']],
		['', ' ', [' ']],
		[' a', ' a ', [' ']],
		[' a 　', ' a 　 ', [' ']],
		[' a', ' a  　  ', [' ', '　']],
	])('trimEnd', (expected: string, input: string, characters: string[]) => {
		expect(string.trimEnd(input, new Set(characters))).toBe(expected);
	});

	test.each([
		['', '', []],
		['', '', ['']],
		['a', ' a ', [' ']],
		['　 a 　', ' 　 a 　 ', [' ']],
		['a', ' 　 a 　 ', [' ', '　']],
	])('trim', (expected: string, input: string, characters: string[]) => {
		expect(string.trim(input, new Set(characters))).toBe(expected);
	});

	test.each([
		['', ''],
		['', ' '],
		['a', ' a '],
		['a', ' 　 a 　 '],
		['a', ' 　 a 　 '],
	])('trim:default', (expected: string, input: string) => {
		expect(string.trim(input)).toBe(expected);
	});

	test('replaceAllImpl', () => {
		expect(string.replaceAllImpl('abcabcABCABC', 'a', '-')).toBe('-bc-bcABCABC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/, '-')).toBe('-bc-bcABCABC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/i, '-')).toBe('-bc-bc-BC-BC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/g, '-')).toBe('-bc-bcABCABC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/gi, '-')).toBe('-bc-bc-BC-BC');
	});

	test.each([
		[[], null],
		[[], undefined],
		[[], ''],
		[['a'], 'a'],
		[['a', 'b'], "a\r\nb"],
		[['a', 'b'], "a\rb"],
		[['a', 'b'], "a\nb"],
		[['', ''], "\r\n"],
		[['', ''], "\n"],
		[['', ''], "\r"],
		[['a', 'b', 'c'], "a\rb\nc"],
	])('splitLines', (expected: Array<string>, input: string | null | undefined) => {
		const actual = string.splitLines(input);
		expect(actual).toEqual(expected);
	})

	test.each([
		[false, null],
		[false, undefined],
		[false, ''],
		[false, 't'],
		[false, 'on'],
		[false, 'yes'],
		[true, 'true'],
		[true, 'True'],
		[true, 'TRUE'],
	])('toBoolean', (expected: boolean, input: string | null | undefined) => {
		expect(string.toBoolean(input)).toBe(expected);
	});

	test.each([
		[true, 'abc', 'a', false],
		[true, 'abc', 'b', false],
		[true, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[true, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Partial', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Partial);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[true, 'abc', 'a', false],
		[false, 'abc', 'b', false],
		[false, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[true, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Forward', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Forward);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[false, 'abc', 'a', false],
		[false, 'abc', 'b', false],
		[true, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[false, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Backward', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Backward);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[false, 'abc', 'a', false],
		[false, 'abc', 'b', false],
		[false, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[false, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Perfect', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Perfect);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[true, 'abc', 'a', false],
		[true, 'abc', 'b', false],
		[true, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[true, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
		[true, 'abc', '...', false],
		[false, 'abc', '....', false],
	])('match:Regex', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Regex);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBe(expected);
	});
});

