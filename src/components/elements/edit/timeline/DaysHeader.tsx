import { NextPage } from "next";

import { useLocale } from "@/locales/locale";
import { Holiday, HolidayEvent, Theme } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { EditProps } from "@/models/data/props/EditProps";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";
import { TimelineStore } from "@/models/store/TimelineStore";
import { TimeZone } from "@/models/TimeZone";
import { CalendarRange } from "@/models/data/CalendarRange";
import { DateTime } from "@/models/DateTime";

interface Props extends EditProps {
	timelineStore: TimelineStore;
	timeZone: TimeZone;
	calendarRange: CalendarRange;
}

const Component: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const days = Timelines.getCalendarRangeDays(props.calendarRange);

	const dates = Array.from(Array(days), (_, index) => {
		const date = props.calendarRange.from.add(TimeSpan.fromDays(index));
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
				<thead>
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
							const holidayEvent = getHolidayEvent(a, props.editData.setting.calendar.holiday.events);
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} id={Timelines.toDaysId(a)} title={holidayEvent?.display} className={className}>
									<time dateTime={a.format("U")}>{a.day}</time>
								</td>
							)
						})}
					</tr>
					<tr className='week'>
						{dates.map(a => {
							const holidayEvent = getHolidayEvent(a, props.editData.setting.calendar.holiday.events);
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} title={holidayEvent?.display} className={className}>
									{locale.common.calendar.week.short[Settings.toWeekDay(a.week)]}
								</td>
							);
						})}
					</tr>
				</thead>
				<tbody>
					<tr className='pin'>
						{dates.map(a => {
							const holidayEvent = getHolidayEvent(a, props.editData.setting.calendar.holiday.events);
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} title={holidayEvent?.display} className={className}>
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

export default Component;

function getWeekDayClassName(date: DateTime, regulars: Holiday["regulars"], theme: Theme): string {

	for (const regular of regulars) {
		const weekday = Settings.toWeekDay(date.week);
		if (regular === weekday) {
			return "_dynamic_theme_holiday_regulars_" + regular;
		}
	}

	return "";
}

//TODO: getHolidayClassNameの計算と重複
function getHolidayEvent(date: DateTime, events: Holiday["events"]): HolidayEvent | null {
	const dateText = date.format("yyyy-MM-dd");
	if (dateText in events) {
		const holidayEvent = events[dateText];
		return holidayEvent;
	}

	return null;
}

function getHolidayClassName(date: DateTime, events: Holiday["events"], theme: Theme): string {

	const holidayEvent = getHolidayEvent(date, events);
	if (holidayEvent) {
		if (holidayEvent) {
			return "_dynamic_theme_holiday_events_" + holidayEvent.kind;
		}
	}

	return "";
}

function getDayClassNames(date: DateTime, setting: Holiday, theme: Theme): Array<string> {
	const weekClassName = getWeekDayClassName(date, setting.regulars, theme);
	const holidayClassName = getHolidayClassName(date, setting.events, theme);

	return [weekClassName, holidayClassName].filter(a => a);
}

function getCellClassName(customClassNames: ReadonlyArray<string>): string {
	return ["cell", "_dynamic_design_cell", ...customClassNames].join(" ");
}
