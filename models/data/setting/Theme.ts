import { Color } from "./Color";
import { WeekDay } from "./WeekDay";
import { HolidayKind } from "./Holiday";

export interface Theme {
	holiday: {
		regulars: { [key in WeekDay]?: Color };
		events: { [key in HolidayKind]: Color };
	},
	groups: Array<Color>;
	completed: Color;
}
