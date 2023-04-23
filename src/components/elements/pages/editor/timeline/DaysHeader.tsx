import { NextPage } from "next";

import { useLocale } from "@/locales/locale";
import { Calendars } from "@/models/Calendars";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { EditProps } from "@/models/data/props/EditProps";
import { Holiday, Theme } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";

interface Props extends EditProps {
	timelineStore: TimelineStore;
	calendarInfo: CalendarInfo;
}

const DaysHeader: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const days = Calendars.getCalendarRangeDays(props.calendarInfo.range);

	const dates = Array.from(Array(days), (_, index) => {
		const date = props.calendarInfo.range.from.add(TimeSpan.fromDays(index));
		return date;
	});

	type YearMonth = {
		year: number,
		month: number,
		length: number,
		date: DateTime,
	};
	const yearMonthBucket: Array<YearMonth> = [];
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

	return (
		<div id='days-header'>
			<table>
				<tbody>
					<tr className='year-month'>
						{yearMonthBucket.map(a => {
							const year = a.year;
							const month = a.month;

							const display = a.date.format(locale.common.calendar.format.yearMonth);
							const dateTime = `${year}-${month}`;

							return (
								<td key={display} className="cell _dynamic_design_cell" colSpan={a.length}>
									<time dateTime={dateTime}>{display}</time>
								</td>
							);
						})}
					</tr>
					<tr className='day'>
						{dates.map(a => {
							const holidayEventValue = Calendars.getHolidayEventValue(a, props.calendarInfo.holidayEventMap);
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday.regulars, holidayEventValue, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} id={Timelines.toDaysId(a)} title={holidayEventValue?.event.display} className={className}>
									<time dateTime={a.format("U")}>{a.day}</time>
								</td>
							);
						})}
					</tr>
					<tr className='week'>
						{dates.map(a => {
							const holidayEventValue = Calendars.getHolidayEventValue(a, props.calendarInfo.holidayEventMap);
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday.regulars, holidayEventValue, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} title={holidayEventValue?.event.display} className={className}>
									{locale.common.calendar.week.short[Settings.toWeekDay(a.week)]}
								</td>
							);
						})}
					</tr>
					<tr className='pin'>
						{dates.map(a => {
							const holidayEventValue = Calendars.getHolidayEventValue(a, props.calendarInfo.holidayEventMap);
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday.regulars, holidayEventValue, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} title={holidayEventValue?.event.display} className={className}>
									@
								</td>
							);
						})}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default DaysHeader;

function getWeekDayClassName(date: DateTime, regulars: Holiday["regulars"], theme: Theme): string {

	for (const regular of regulars) {
		const weekday = Settings.toWeekDay(date.week);
		if (regular === weekday) {
			return "_dynamic_theme_holiday_regulars_" + regular;
		}
	}

	return "";
}

function getHolidayClassName(date: DateTime, holidayEventValue: HolidayEventMapValue | null, theme: Theme): string {
	if (holidayEventValue) {
		if (holidayEventValue) {
			return "_dynamic_theme_holiday_events_" + holidayEventValue.event.kind;
		}
	}

	return "";
}

function getDayClassNames(date: DateTime, regularHolidays: Holiday["regulars"], holidayEventValue: HolidayEventMapValue | null, theme: Theme): Array<string> {
	const weekClassName = getWeekDayClassName(date, regularHolidays, theme);
	const holidayClassName = getHolidayClassName(date, holidayEventValue, theme);

	return [weekClassName, holidayClassName].filter(a => a);
}

function getCellClassName(customClassNames: ReadonlyArray<string>): string {
	return ["cell", "_dynamic_design_cell", ...customClassNames].join(" ");
}
