import { Color } from "@/models/Color";

describe("DateTime", () => {
	test.each([
		[""],
		["tryParse"],
		["#"],
		["#0"],
		["#00"],
		["#RGB"],
		["#fffffX"],
	])("try", (input: string) => {
		expect(Color.tryParse(input)).toBeNull();
	});
});
