import * as number from '../../../models/core/number';
import * as throws from '../../../models/core/throws';

describe('number', () => {
	test('padding', () => {
		expect(number.padding(0, 2, ' ')).toBe(' 0');
		expect(number.padding(1, 2, ' ')).toBe(' 1');
		expect(number.padding(10, 2, ' ')).toBe('10');
		expect(number.padding(100, 2, ' ')).toBe('100');
		expect(number.padding(100, 4, ' ')).toBe(' 100');
		expect(number.padding(100, 4, '0')).toBe('0100');
		expect(number.padding(10, 4, '0')).toBe('0010');
		expect(number.padding(1, 4, '0')).toBe('0001');
		expect(() => number.padding(-1, 10, '0')).toThrow();
		expect(() => number.padding(1, 10, '00')).toThrow();
	});

	test.each([
		[0, '0', undefined],
		[0, '+0', undefined],
		[-0, '-0', undefined],
		[123, '+123', undefined],
		[-123, '-123', undefined],
		[10, '10', undefined],
		[10, '10.5', undefined],
		[0xf, 'f', 16],
	])('parseInt', (expected: number, input: string, radix: number | undefined) => {
		expect(number.parseInt(input, radix)).toBe(expected);
	});

	test.each([
		['', undefined],
		['a', undefined],
		['f', 10],
	])('parseInt-throws', (input: string, radix: number | undefined) => {
		expect(() => number.parseInt(input, radix)).toThrowError(throws.ParseError);
	});

	test.each([
		[0, '0', 42, undefined],
		[0, '+0', 42, undefined],
		[-0, '-0', 42, undefined],
		[123, '+123', 42, undefined],
		[-123, '-123', 42, undefined],
		[10, '10', 42, undefined],
		[0xf, 'f', 42, 16],
		[42, 'a', 42, undefined],
	])('parseIntOr', (expected: number, input: string, fallback: number, radix: number | undefined) => {
		expect(number.parseIntOr(input, fallback, radix)).toBe(expected);
	});

	test('parseIntOr-ParseError', () => {
		expect(() => number.parseIntOr('10', 1.5)).toThrowError(throws.ArgumentError);
	});

	test.each([
		[0, '0'],
		[0, '+0'],
		[-0, '-0'],
		[123, '+123'],
		[-123, '-123'],
		[10, '10'],
		[10.5, '10.5'],
	])('parseFloat', (expected: number, input: string) => {
		expect(number.parseFloat(input)).toBe(expected);
	});

	test.each([
		[1.5, '1.5', 42],
		[42, '', 42],
		[42, 'f', 42],
	])('parseFloatOr', (expected: number, input: string, fallback: number) => {
		expect(number.parseFloatOr(input, fallback)).toBe(expected);
	});
});
