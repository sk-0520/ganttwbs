import { NextPage } from "next";

import { useLocale } from "@/models/locales/locale";
import { Holiday, Theme } from "@/models/data/Setting";
import { Strings } from "@/models/Strings";
import { Settings } from "@/models/Settings";
import { EditProps } from "@/models/data/props/EditProps";
import { TimeSpan } from "@/models/TimeSpan";
import { Timelines } from "@/models/Timelines";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const range = {
		from: new Date(props.editData.setting.calendar.range.from),
		to: new Date(props.editData.setting.calendar.range.to),
	};

	const diff = TimeSpan.diff(range.to, range.from);
	const days = diff.totalDays + 1;

	const dates = Array.from(Array(days), (_, index) => {
		const date = new Date(range.from.getTime());
		date.setDate(date.getDate() + index);
		return date;
	});

	const yearMonthBucket: Array<{ year: number, month: number, length: number }> = [];
	for (const date of dates) {
		const yearTargets = yearMonthBucket.filter(a => a.year === date.getFullYear());
		if (yearTargets.length) {
			const target = yearTargets.find(a => a.month === date.getMonth());
			if (target) {
				target.length += 1;
			} else {
				yearMonthBucket.push({ year: date.getFullYear(), month: date.getMonth(), length: 1 });
			}
		} else {
			yearMonthBucket.push({ year: date.getFullYear(), month: date.getMonth(), length: 1 });
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
							const month = a.month + 1;

							const display = `${year}/${month}`;
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
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} id={Timelines.toDaysId(a)} className={className}>
									<time dateTime={a.toISOString()}>{a.getDate()}</time>
								</td>
							)
						})}
					</tr>
					<tr className='week'>
						{dates.map(a => {
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} className={className}>
									{locale.calendar.week.short[Settings.toWeekDay(a.getDay())]}
								</td>
							);
						})}
					</tr>
				</thead>
				<tbody>
					<tr className='pin'>
						{dates.map(a => {
							const classNames = getDayClassNames(a, props.editData.setting.calendar.holiday, props.editData.setting.theme);
							const className = getCellClassName(classNames);

							return (
								<td key={a.getTime()} className={className}>
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

function getWeekDayClassName(date: Date, regulars: Holiday['regulars'], theme: Theme): string {

	for (const regular of regulars) {
		const weekday = Settings.toWeekDay(date.getDay());
		if (regular === weekday) {
			return "_dynamic_theme_holiday_regulars_" + regular;
		}
	}

	return "";
}

function getHolidayClassName(date: Date, events: Holiday['events'], theme: Theme): string {

	const dateText = Strings.formatDate(date, 'yyyy-MM-dd');
	if (dateText in events) {
		const holidayEvent = events[dateText];
		if (holidayEvent) {
			return "_dynamic_theme_holiday_events_" + holidayEvent.kind;
		}
	}

	return "";
}

function getDayClassNames(date: Date, setting: Holiday, theme: Theme): Array<string> {
	const weekClassName = getWeekDayClassName(date, setting.regulars, theme);
	const holidayClassName = getHolidayClassName(date, setting.events, theme);

	return [weekClassName, holidayClassName].filter(a => a);
}

function getCellClassName(customClassNames: ReadonlyArray<string>): string {
	return ["cell", "_dynamic_design_cell", ...customClassNames].join(" ");
}
