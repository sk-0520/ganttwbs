import { Types } from "@/models/Types";

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
		expect(Types.toBoolean(input)).toBe(expected);
	});
});
