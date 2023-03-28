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

});
