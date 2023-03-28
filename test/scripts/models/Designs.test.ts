import { ValueUnit } from "../../../models/data/Design";
import { Designs } from "../../../models/Designs";

describe("Designs", () => {

	test.each([
		["1px", { value: 1, unit: "px" }],
		["1234em", { value: 1234, unit: "em" }],
		["0", { value: 0, unit: "px" }],
		["0", { value: 0, unit: "em" }],
	])("toProperty", (expected: string, input: ValueUnit) => {
		expect(Designs.toProperty(input)).toBe(expected);
	});

	test("convertStyleClasses-simple", () => {
		const input = {
			name: {
				a: "test",
				b: "bbbb",
			},
		};

		const actual = Designs.convertStyleClasses(input, []);

		expect(actual.has('name')).toBeTruthy();
		expect(actual.get('name')?.get("a")).toBe("test");
		expect(actual.get('name')?.get("b")).toBe("bbbb");
	});

	test("convertStyleClasses-nested", () => {
		const input = {
			name: {
				a: "aaaa",
				b: "bbbb",

				nested: {
					a2: "nestA",
					b2: "nestB",
				},

				c: "cccc",
			},
		};

		const actual = Designs.convertStyleClasses(input, []);

		expect(actual.has('name')).toBeTruthy();
		expect(actual.get('name')?.get("a")).toBe("aaaa");
		expect(actual.get('name')?.get("b")).toBe("bbbb");
		expect(actual.get('name')?.get("c")).toBe("cccc");

		expect(actual.has('name_nested')).toBeTruthy();
		expect(actual.get('name_nested')?.get("a2")).toBe("nestA");
		expect(actual.get('name_nested')?.get("b2")).toBe("nestB");
	});

	test("convertStyleClasses-nested-nested", () => {
		const input = {
			name: {
				a: "aaaa",
				b: "bbbb",

				nested: {
					a2: "nestA",
					b2: "nestB",

					c2: {
						abc: "def",
					}
				},

				c: "cccc",
			},
		};

		const actual = Designs.convertStyleClasses(input, []);

		expect(actual.has('name')).toBeTruthy();
		expect(actual.get('name')?.get("a")).toBe("aaaa");
		expect(actual.get('name')?.get("b")).toBe("bbbb");
		expect(actual.get('name')?.get("c")).toBe("cccc");

		expect(actual.has('name_nested')).toBeTruthy();
		expect(actual.get('name_nested')?.get("a2")).toBe("nestA");
		expect(actual.get('name_nested')?.get("b2")).toBe("nestB");

		expect(actual.has('name_nested_c2')).toBeTruthy();
		expect(actual.get('name_nested_c2')?.get("abc")).toBe("def");
	});
});
