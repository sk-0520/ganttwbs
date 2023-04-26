import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

describe("Timelines", () => {
	test("root timeline", () => {
		const timeline = Timelines.createRootTimeline();
		expect(Settings.maybeRootTimeline(timeline)).toBeTruthy();
		expect(Settings.maybeGroupTimeline(timeline)).toBeTruthy();
		expect(Settings.maybeTaskTimeline(timeline)).toBeFalsy();
	});

	test("group timeline", () => {
		const timeline = Timelines.createGroupTimeline();
		expect(Settings.maybeRootTimeline(timeline)).toBeFalsy();
		expect(Settings.maybeGroupTimeline(timeline)).toBeTruthy();
		expect(Settings.maybeTaskTimeline(timeline)).toBeFalsy();
	});

	test("task timeline", () => {
		const timeline = Timelines.createTaskTimeline();
		expect(Settings.maybeRootTimeline(timeline)).toBeFalsy();
		expect(Settings.maybeGroupTimeline(timeline)).toBeFalsy();
		expect(Settings.maybeTaskTimeline(timeline)).toBeTruthy();
	});

});

