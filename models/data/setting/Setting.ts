import Calendar from "./Calendar";
import { Theme } from "./Theme";
import * as Timeline from "./Timeline";
import * as Version from "./Version";

export interface Setting {
	name: string;
	calendar: Calendar;
	theme: Theme;
	timelines: Array<Timeline.MarkerTimeline | Timeline.PinTimeline | Timeline.TaskTimeline>;
	versions: Array<Version.VersionItem>;
}
