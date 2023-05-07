import { FC, useMemo } from "react";

import { useLocale } from "@/locales/locale";
import { Arrays } from "@/models/Arrays";
import { Calendars } from "@/models/Calendars";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { Holiday, Theme } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";
import { DayInfo } from "@/models/data/DayInfo";


interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {
	//nop
}

type YearMonth = {
	year: number,
	month: number,
	length: number,
	date: DateTime,
};

const DaysHeader: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const { dates, yearMonthBucket } = useMemo(() => {
		console.debug("DaysHeader - dates", new Date());
		const days = Calendars.getCalendarRangeDays(props.calendarInfo.range);
		const dates = Arrays
			.range(0, days)
			.map(a => props.calendarInfo.range.begin.add(TimeSpan.fromDays(a)))
			;

		const yearMonthBucket = new Array<YearMonth>();
		for (const date of dates) {
			const yearTargets = yearMonthBucket.filter(a => a.year === date.year);
			if (yearTargets.length) {
				const target = yearTargets.find(a => a.month === date.month);
				if (target) {
					target.length += 1;
				} else {
					yearMonthBucket.push({ year: date.year, month: date.month, length: 1, date: date });
				}
			} else {
				yearMonthBucket.push({ year: date.year, month: date.month, length: 1, date: date });
			}
		}
		yearMonthBucket.sort((a, b) => {
			const year = a.year - b.year;
			if (year) {
				return year;
			}
			return a.month - b.month;
		});

		return {
			dates,
			yearMonthBucket
		};
	}, [props.calendarInfo]);

	const yearMonthNodes = useMemo(() => {
		console.debug("renderYearMonthrenderYearMonthrenderYearMonth");
		return yearMonthBucket.map(a => {
			const year = a.year;
			const month = a.month;

			const display = a.date.format(locale.common.calendar.yearMonthFormat);
			const dateTime = `${year}-${month}`;

			return (
				<td key={display} className="cell _dynamic_design_cell" colSpan={a.length}>
					<time dateTime={dateTime}>{display}</time>
				</td>
			);
		});
	}, [locale, yearMonthBucket]);

	const dayNodes = useMemo(() => {
		console.debug("renderDayrenderDayrenderDayrenderDay");
		return dates.map(a => {
			const holidayEventValue = Calendars.getHolidayEventValue(a, props.calendarInfo.holidayEventMap);
			const classNames = getDayClassNames(a, props.setting.calendar.holiday.regulars, holidayEventValue, props.setting.theme);
			const className = getCellClassName(classNames);

			return (
				<td key={a.ticks} id={Timelines.toDaysId(a)} title={holidayEventValue?.event.display} className={className}>
					<time dateTime={a.format("U")}>{a.day}</time>
				</td>
			);
		});
	}, [dates, props.calendarInfo, props.setting]);

	const weekNodes = useMemo(() => {
		console.debug("renderWeekrenderWeekrenderWeek");
		return dates.map(a => {
			const holidayEventValue = Calendars.getHolidayEventValue(a, props.calendarInfo.holidayEventMap);
			const classNames = getDayClassNames(a, props.setting.calendar.holiday.regulars, holidayEventValue, props.setting.theme);
			const className = getCellClassName(classNames);

			return (
				<td key={a.ticks} title={holidayEventValue?.event.display} className={className}>
					{locale.common.calendar.week.short[Settings.toWeekDay(a.week)]}
				</td>
			);
		});
	}, [dates, locale, props.calendarInfo, props.setting]);

	function renderPins() {
		console.debug("renderPinrenderPinrenderPin");
		return dates.map(a => {
			const holidayEventValue = Calendars.getHolidayEventValue(a, props.calendarInfo.holidayEventMap);
			const classNames = getDayClassNames(a, props.setting.calendar.holiday.regulars, holidayEventValue, props.setting.theme);
			const className = getCellClassName(classNames);

			const mergedDayInfo: DayInfo = {
				duplicateMembers: new Set(),
				targetTimelines: new Set(),
			};
			const nextDay = a.add(1, "day");
			for (const [ticks, info] of props.timelineStore.dayInfos) {
				if (a.ticks <= ticks && ticks < nextDay.ticks) {
					console.debug(info);
					for (const memberId of info.duplicateMembers) {
						mergedDayInfo.duplicateMembers.add(memberId);
					}
				}
			}

			return (
				<td key={a.ticks} title={holidayEventValue?.event.display} className={className}>
					{0 < mergedDayInfo.duplicateMembers.size ? (
						"@"
					) : (
						<>&nbsp;</>
					)}
				</td>
			);
		});
	}

	return (
		<div id="days-header">
			<table>
				<tbody>
					<tr className="year-month">
						{yearMonthNodes}
					</tr>
					<tr className="day">
						{dayNodes}
					</tr>
					<tr className="week">
						{weekNodes}
					</tr>
					<tr className="pin">
						{renderPins()}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default DaysHeader;

function getWeekDayClassName(date: DateTime, regulars: Readonly<Holiday["regulars"]>, theme: Readonly<Theme>): string {

	for (const regular of regulars) {
		const weekday = Settings.toWeekDay(date.week);
		if (regular === weekday) {
			return "_dynamic_theme_holiday_regulars_" + regular;
		}
	}

	return "";
}

function getHolidayClassName(date: DateTime, holidayEventValue: HolidayEventMapValue | null, theme: Readonly<Theme>): string {
	if (holidayEventValue) {
		if (holidayEventValue) {
			return "_dynamic_theme_holiday_events_" + holidayEventValue.event.kind;
		}
	}

	return "";
}

function getDayClassNames(date: DateTime, regularHolidays: Readonly<Holiday["regulars"]>, holidayEventValue: HolidayEventMapValue | null, theme: Readonly<Theme>): Array<string> {
	const weekClassName = getWeekDayClassName(date, regularHolidays, theme);
	const holidayClassName = getHolidayClassName(date, holidayEventValue, theme);

	return [weekClassName, holidayClassName].filter(a => a);
}

function getCellClassName(customClassNames: ReadonlyArray<string>): string {
	return ["cell", "_dynamic_design_cell", ...customClassNames].join(" ");
}
