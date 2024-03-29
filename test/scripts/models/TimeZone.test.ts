import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";


describe("TimeZone", () => {

	test.each([
		["+00:30", TimeSpan.fromMinutes(30)],
		["+09:00", TimeSpan.fromMinutes(540)],
		["+09:30", TimeSpan.fromMinutes(570)],
		["-00:30", TimeSpan.fromMinutes(-30)],
		["-09:00", TimeSpan.fromMinutes(-540)],
		["-09:30", TimeSpan.fromMinutes(-570)],
	])("serialize", (expected: string, input: TimeSpan) => {
		const timezone = TimeZone.create(input);
		expect(timezone.serialize()).toBe(expected);
	});

	test.each([
		[TimeSpan.fromMinutes(30), "+00:30"],
		[TimeSpan.fromMinutes(540), "+09:00"],
		[TimeSpan.fromMinutes(570), "+09:30"],
		[TimeSpan.fromMinutes(-30), "-00:30"],
		[TimeSpan.fromMinutes(-540), "-09:00"],
		[TimeSpan.fromMinutes(-570), "-09:30"],
	])("parse", (expected: TimeSpan, input: string) => {
		const actual = TimeZone.parse(input);
		expect(actual).toBeTruthy();
		expect((actual as never)["offset"]["ticks"]).toBe(expected.ticks);
	});

	test.each([
		["09:00"],
		["+0900"],
		["-0900"],
		["*09:00"],
	])("tryParse null", (input: string) => {
		const actual = TimeZone.tryParse(input);
		expect(actual).toBeNull();
	});
});
