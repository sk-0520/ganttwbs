import { Timelines } from "@/models/Timelines";

describe("Timelines", () => {
	test.each([
		["1", [], 0],
		["2", [], 1],
		["1.2", [0], 1],
		["2.2", [1], 1],
	])("toIndexNumber", (expected: string, indexTree: readonly number[], currentIndex: number) => {
		expect(Timelines.toIndexNumber(indexTree, currentIndex)).toBe(expected);
	});
});
