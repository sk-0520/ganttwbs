import { Color } from "./Color";
import { WeekDay } from "./WeekDay";
import { HolidayKind } from "./Holiday";

export interface Theme {
	holiday: {
		regulars: Map<WeekDay, Color>;
		events: Map<HolidayKind, Color>;
	},
	groups: Array<Color>;
	end: Color;
}
