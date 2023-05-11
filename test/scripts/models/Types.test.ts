import { Constructor, Types } from "@/models/Types";

class TestSuper { }
class TestSub1 extends TestSuper { }
class TestSub1Sub extends TestSub1 { }
class TestSub1SubSub extends TestSub1Sub { }
class TestSub2 extends TestSuper { }

class TestDeepSuper {
	public A = 10;
	public get Z(): string {
		return "Z";
	}
}
class TestDeep extends TestDeepSuper {
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

describe("Types", () => {

	test.each([
		[true, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, "A"],
		[false, true],
		[false, ["A"]],
		[false, { a: "A" }],
		[false, () => undefined],
	])("isUndefined", (expected: boolean, input: unknown) => {
		expect(Types.isUndefined(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[true, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, "A"],
		[false, true],
		[false, ["A"]],
		[false, { a: "A" }],
		[false, () => undefined],
	])("isNull", (expected: boolean, input: unknown) => {
		expect(Types.isNull(input)).toBe(expected);
	});

	test.each([
		[true, undefined],
		[true, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[false, "A"],
		[false, true],
		[false, ["A"]],
		[false, { a: "A" }],
		[false, () => undefined],
	])("isNullish", (expected: boolean, input: unknown) => {
		expect(Types.isNullish(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[false, Symbol()],
		[false, 1],
		[false, 9007199254740991n],
		[true, "A"],
		[false, true],
		[false, ["A"]],
		[false, { a: "A" }],
		[false, () => undefined],
	])("isString", (expected: boolean, input: unknown) => {
		expect(Types.isString(input)).toBe(expected);
	});

	test.each([
		[false, undefined],
		[false, null],
		[true, Symbol()],
		[false, 0],
		[true, 1],
		[false, 0n],
		[true, 9007199254740991n],
		[false, ""],
		[true, "A"],
		[false, false],
		[true, true],
		[true, []],
		[true, ["A"]],
		[true, { a: "A" }],
		[true, () => undefined],
	])("toBoolean", (expected: boolean, input: unknown) => {
		expect(Boolean(input)).toBe(expected);
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
	])("instanceOf", <T1, T2 extends object>(expected: boolean, obj: T1, type: Constructor<T2>) => {
		expect(Types.instanceOf(obj, type)).toBe(expected);
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
	])("isEqual", <T1, T2 extends object>(expected: boolean, obj: T1, type: Constructor<T2>) => {
		expect(Types.isEqual(obj, type)).toBe(expected);
	});

	test("getProperties", () => {
		const input = new TestDeep(-1, { b: "A", node: { c: true } });

		const actual1 = Types.getProperties(input);
		expect(actual1.size).toBeGreaterThanOrEqual(5);

		expect(actual1.has("A")).toBeTruthy();
		expect(actual1.has("Z")).toBeTruthy();

		expect(actual1.has("a")).toBeTruthy();
		expect(actual1.has("b")).toBeTruthy();
		expect(actual1.has("c")).toBeTruthy();
	});
});
