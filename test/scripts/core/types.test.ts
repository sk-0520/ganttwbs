import * as types from '../../../models/core/types';

const _symbol = Symbol();
const _inputObject = {
	undefined: undefined,
	null: null,
	symbol: _symbol,
	number: 1,
	bigint: 9007199254740991n,
	string: 'A',
	boolean: true,
	array: ['A'],
	object: { a: 'A' },
	function: () => undefined,
};
const inputObject: unknown = _inputObject;

class TestSuper { }
class TestSub1 extends TestSuper { }
class TestSub1Sub extends TestSub1 { }
class TestSub1SubSub extends TestSub1Sub { }
class TestSub2 extends TestSuper { }

interface TestFlat {
	a: number;
	b: string;
	c: boolean;
}
class TestDeepSuper {
	public A = 10;
	public get Z(): string {
		return 'Z';
	}
}

class TestDeep extends TestDeepSuper implements TestFlat {
	public constructor(public a: number, private nest: { b: string, node: { c: boolean } }) {
		super();
	}

	public get b(): string {
		return this.nest.b;
	}

	public get c(): boolean {
		return this.nest.node.c;
	}
}

describe('types', () => {
	test.each([
		[true, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isUndefined', (expected: boolean, input: unknown) => {
		expect(types.isUndefined(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[true, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isNull', (expected: boolean, input: unknown) => {
		expect(types.isNull(input)).toBe(expected);
	});

	test.each([
		[true, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isUndefined', (expected: boolean, input: unknown) => {
		expect(types.isUndefined(input)).toBe(expected);
	});

	test.each([
		[true, undefined],
		[true, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isNullish', (expected: boolean, input: unknown) => {
		expect(types.isNullish(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[true, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isSymbol', (expected: boolean, input: unknown) => {
		expect(types.isSymbol(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[true, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isString', (expected: boolean, input: unknown) => {
		expect(types.isString(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[true, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isNumber', (expected: boolean, input: unknown) => {
		expect(types.isNumber(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[true, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isBigInt', (expected: boolean, input: unknown) => {
		expect(types.isBigInt(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[true, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isBoolean', (expected: boolean, input: unknown) => {
		expect(types.isBoolean(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[true, ['A']],
		[false, { a: 'A' }],
		[false, () => undefined],
	])('isArray', (expected: boolean, input: unknown) => {
		expect(types.isArray(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, 'A'],
		[false, true],
		[false, ['A']],
		[false, { a: 'A' }],
		[true, () => undefined],
	])('isFunction', (expected: boolean, input: unknown) => {
		expect(types.isFunction(input)).toBe(expected);
	});

	test('hasProperty', () => {
		const a1: unknown = {
			a: 1,
			b: 'B',
		};
		expect(types.hasProperty(a1, 'a')).toBeTruthy();
		expect(types.hasProperty(a1, 'b')).toBeTruthy();
		expect(types.hasProperty(a1, 'c')).toBeFalsy();
	});

	test.each([
		[true, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasUndefined', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasUndefined(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[true, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasNull', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasNull(input, key)).toBe(expected);
	});

	test.each([
		[true, inputObject, 'undefined'],
		[true, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasNullish', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasNullish(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[true, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasSymbol', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasSymbol(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[true, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasString', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasString(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[true, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasNumber', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasNumber(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[true, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasBigInt', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasBigInt(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[true, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasBoolean', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasBoolean(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[true, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasObject', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasObject(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[true, inputObject, 'array'],
		[false, inputObject, 'object'],
		[false, inputObject, 'function'],
	])('hasArray', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasArray(input, key)).toBe(expected);
	});

	test.each([
		[false, inputObject, 'undefined'],
		[false, inputObject, 'null'],
		[false, inputObject, 'symbol'],
		[false, inputObject, 'number'],
		[false, inputObject, 'bigint'],
		[false, inputObject, 'string'],
		[false, inputObject, 'boolean'],
		[false, inputObject, 'array'],
		[false, inputObject, 'object'],
		[true, inputObject, 'function'],
	])('hasFunction', (expected: boolean, input: unknown, key: string) => {
		expect(types.hasFunction(input, key)).toBe(expected);
	});

	test.each([
		[undefined, inputObject, 'undefined', undefined],
		[null, inputObject, 'null', null],
		[_symbol, inputObject, 'symbol', _symbol],
		[1, inputObject, 'number', 1],
		[1, inputObject, 'number', 100],
		[100, inputObject, 'number1', 100],
		[9007199254740991n, inputObject, 'bigint', 9007199254740991n],
		['a', inputObject, 'bigint', 'a'],
		['A', inputObject, 'string', 'A'],
		[true, inputObject, 'boolean', true],
		[_inputObject.array, inputObject, 'array', ['A']],
		[_inputObject.object, inputObject, 'object', { a: 'A' }],
		[_inputObject.function, inputObject, 'function', () => undefined],
	])('getPropertyOr', <T>(expected: T, input: unknown, key: string, value: T) => {
		expect(types.getPropertyOr(input, key, value)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, 'a'],
		[false, 1],
		[true, []],
		[false, [null]],
		[false, [1]],
		[true, ['1']],
		[false, [true]],
		[false, [{}]],
	])('isStringArray', (expected: boolean, array: unknown) => {
		expect(types.isStringArray(array)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, 'a'],
		[false, 1],
		[true, []],
		[false, [null]],
		[true, [1]],
		[false, ['1']],
		[false, [true]],
		[false, [{}]],
	])('isNumberArray', (expected: boolean, array: unknown) => {
		expect(types.isNumberArray(array)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, 'a'],
		[false, 1],
		[true, []],
		[false, [null]],
		[false, [1]],
		[false, ['1']],
		[true, [true]],
		[false, [{}]],
	])('isBooleanArray', (expected: boolean, array: unknown) => {
		expect(types.isBooleanArray(array)).toBe(expected);
	});

	test.each([
		[[], undefined],
		[[], null],
		[[], 'a'],
		[[], 1],
		[[], []],
		[[], [null]],
		[[], [1]],
		[['1'], ['1']],
		[[], [true]],
		[[], [{}]],
		[['1', '2', '3'], ['1', 1, '2', false, '3']],
	])('filterStringArray', <T>(expected: Array<T>, array: unknown) => {
		expect(types.filterStringArray(array)).toEqual(expected);
	});

	test.each([
		[[], undefined],
		[[], null],
		[[], 'a'],
		[[], 1],
		[[], []],
		[[], [null]],
		[[1], [1]],
		[[], ['1']],
		[[], [true]],
		[[], [{}]],
		[[1], ['1', 1, '2', false, '3']],
	])('filterNumberArray', <T>(expected: Array<T>, array: unknown) => {
		expect(types.filterNumberArray(array)).toEqual(expected);
	});

	test.each([
		[[], undefined],
		[[], null],
		[[], 'a'],
		[[], 1],
		[[], []],
		[[], [null]],
		[[], [1]],
		[[], ['1']],
		[[true], [true]],
		[[], [{}]],
		[[false], ['1', 1, '2', false, '3']],
	])('filterBooleanArray', <T>(expected: Array<T>, array: unknown) => {
		expect(types.filterBooleanArray(array)).toEqual(expected);
	});

	test.each([
		[true, new TestSuper(), TestSuper],
		[true, new TestSub1(), TestSub1],
		[true, new TestSub1Sub(), TestSub1Sub],
		[true, new TestSub1SubSub(), TestSub1SubSub],
		[true, new TestSub2(), TestSub2],

		[true, new TestSub1(), TestSuper],
		[true, new TestSub1Sub(), TestSub1],
		[true, new TestSub1Sub(), TestSuper],
		[true, new TestSub1SubSub(), TestSub1Sub],
		[true, new TestSub1SubSub(), TestSub1],
		[true, new TestSub1SubSub(), TestSuper],
		[true, new TestSub2(), TestSuper],

		[false, new TestSub1SubSub(), TestSub2],

		[false, undefined, TestSuper],
		[false, null, TestSuper],
		[false, {}, TestSuper],
		[false, 0, TestSuper],
	])('instanceOf', <T1, T2 extends object>(expected: boolean, obj: T1, type: types.Constructor<T2>) => {
		expect(types.instanceOf(obj, type)).toBe(expected);
	});

	test.each([
		[true, new TestSuper(), TestSuper],
		[true, new TestSub1(), TestSub1],
		[true, new TestSub1Sub(), TestSub1Sub],
		[true, new TestSub1SubSub(), TestSub1SubSub],
		[true, new TestSub2(), TestSub2],

		[false, new TestSub1(), TestSuper],
		[false, new TestSub1Sub(), TestSub1],
		[false, new TestSub1Sub(), TestSuper],
		[false, new TestSub1SubSub(), TestSub1Sub],
		[false, new TestSub1SubSub(), TestSub1],
		[false, new TestSub1SubSub(), TestSuper],
		[false, new TestSub2(), TestSuper],

		[false, new TestSub1SubSub(), TestSub2],

		[false, undefined, TestSuper],
		[false, null, TestSuper],
		[false, {}, TestSuper],
		[false, 0, TestSuper],
	])('isEqual', <T1, T2 extends object>(expected: boolean, obj: T1, type: types.Constructor<T2>) => {
		expect(types.isEqual(obj, type)).toBe(expected);
	});

	test('getProperties', () => {
		const input = new TestDeep(-1, { b: 'A', node: { c: true } });

		const actual1 = types.getProperties(input);
		expect(actual1.size).toBeGreaterThanOrEqual(5);

		expect(actual1.has('A')).toBeTruthy();
		expect(actual1.has('Z')).toBeTruthy();

		expect(actual1.has('a')).toBeTruthy();
		expect(actual1.has('b')).toBeTruthy();
		expect(actual1.has('c')).toBeTruthy();
	});

	test('flatClone', () => {
		const input = new TestDeep(10, { b: 'str', node: { c: true } });
		const result = types.flatClone<TestFlat>(input);
		const output1 = JSON.parse(JSON.stringify(input)) as TestDeep;
		const output2 = JSON.parse(JSON.stringify(result)) as TestFlat;

		expect(input.a).toBe(result.a);
		expect(input.b).toBe(result.b);
		expect(input.c).toBe(result.c);

		expect(input.a).toBe(output1.a);
		expect('b' in output1).toBeFalsy();
		expect('c' in output1).toBeFalsy();

		expect(input.a).toBe(output2.a);
		expect(input.b).toBe(output2.b);
		expect(input.c).toBe(output2.c);
	});

	test('nameof', () => {
		expect(types.nameof<TestFlat>('a')).toBe('a');
		expect(types.nameof<TestDeepSuper>('A')).toBe('A');

		expect(types.nameof(console.log)).toBe('log');
	});

	test('toString', () => {
		expect(types.toString(null)).toBe('null');

		expect(types.toString(undefined)).toBe('undefined');

		expect(types.toString(false)).toBe('false');
		expect(types.toString(true)).toBe('true');

		expect(types.toString(1)).toBe('1');
	});
});
