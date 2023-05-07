import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { Holiday, Theme } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Settings } from "@/models/Settings";

export abstract class Days {

	public static getWeekDayClassName(date: DateTime, regulars: Readonly<Holiday["regulars"]>, theme: Readonly<Theme>): string {

		for (const regular of regulars) {
			const weekday = Settings.toWeekDay(date.week);
			if (regular === weekday) {
				return "_dynamic_theme_holiday_regulars_" + regular;
			}
		}

		return "";
	}

	public static getHolidayClassName(date: DateTime, holidayEventValue: HolidayEventMapValue | null, theme: Readonly<Theme>): string {
		if (holidayEventValue) {
			if (holidayEventValue) {
				return "_dynamic_theme_holiday_events_" + holidayEventValue.event.kind;
			}
		}

		return "";
	}

	public static getDayClassNames(date: DateTime, regularHolidays: Readonly<Holiday["regulars"]>, holidayEventValue: HolidayEventMapValue | null, theme: Readonly<Theme>): Array<string> {
		const weekClassName = this.getWeekDayClassName(date, regularHolidays, theme);
		const holidayClassName = this.getHolidayClassName(date, holidayEventValue, theme);

		return [weekClassName, holidayClassName].filter(a => a);
	}

	public static getCellClassName(customClassNames: ReadonlyArray<string>): string {
		return ["cell", "_dynamic_design_cell", ...customClassNames].join(" ");
	}

}
