import * as regex from '../../../models/core/regex'

describe('regex', () => {
	test.each([
		["\\*", '*'],
		["\\.", '.'],
		["\\*\\*", '**'],
	])('escape', (expected: string, pattern: string) => {
		expect(regex.escape(pattern)).toBe(expected);
	});
});
