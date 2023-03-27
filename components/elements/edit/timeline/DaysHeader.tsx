import { NextPage } from "next";
import { CSSProperties, useContext } from "react";

import { EditContext } from "@/models/data/context/EditContext";
import { useLocale } from "@/models/locales/locale";
import { Holiday, Theme } from "@/models/data/Setting";
import { Strings } from "@/models/Strings";
import { Settings } from "@/models/Settings";
import EditProps from "@/models/data/props/EditProps";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {
	const locale = useLocale();
	const editContext = useContext(EditContext);

	const range = {
		from: new Date(editContext.data.setting.calendar.range.from),
		to: new Date(editContext.data.setting.calendar.range.to),
	};

	editContext.data.setting.calendar.holiday.regulars
	editContext.data.setting.calendar.holiday.events

	const diff = range.to.getTime() - range.from.getTime();
	const days = diff / (24 * 60 * 60 * 1000);

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

	const cellStyle = editContext.design.cell;

	return (
		<div id='days-header'>
			<table>
				<thead>
					<tr className='year-month'>
						{yearMonthBucket.map(a => {

							const display = `${a.year}/${a.month + 1}`;

							return (
								<td key={display} className={"cell"} colSpan={a.length} style={cellStyle}>{display}</td>
							);
						})}
					</tr>
					<tr className='day'>
						{dates.map(a => {
							const style = getDayStyles(a, editContext.data.setting.calendar.holiday, editContext.data.setting.theme);

							return (
								<td key={a.getTime()} className='cell' style={{ ...cellStyle, ...style }}>
									{a.getDate()}
								</td>
							)
						})}
					</tr>
					<tr className='week'>
						{dates.map(a => {
							const style = getDayStyles(a, editContext.data.setting.calendar.holiday, editContext.data.setting.theme);

							return (
								<td key={a.getTime()} className='cell' style={{ ...cellStyle, ...style }}>
									{locale.calendar.week.short[Settings.toWeekDay(a.getDay())]}
								</td>
							);
						})}
					</tr>
				</thead>
				<tbody>
					<tr className='pin'>
						{dates.map(a => {
							const style = getDayStyles(a, editContext.data.setting.calendar.holiday, editContext.data.setting.theme);

							return (
								<td key={a.getTime()} className='cell' style={{ ...cellStyle, ...style }}>
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

function getWeekDayStyles(date: Date, regulars: Holiday['regulars'], theme: Theme): CSSProperties {
	const styles: CSSProperties = {};

	for (const regular of regulars) {
		const weekday = Settings.toWeekDay(date.getDay());
		if (regular === weekday) {
			const color = theme.holiday.regulars[weekday];
			if (color) {
				styles.backgroundColor = color;
				break;
			}
		}
	}

	return styles;
}

function getHolidayStyles(date: Date, events: Holiday['events'], theme: Theme): CSSProperties {
	const styles: CSSProperties = {};

	const dateText = Strings.formatDate(date, 'yyyy-MM-dd');
	if (dateText in events) {
		const holidayEvent = events[dateText];
		if (holidayEvent) {
			const color = theme.holiday.events[holidayEvent.kind];
			styles.backgroundColor = color;
		}
	}

	return styles;
}

function getDayStyles(date: Date, setting: Holiday, theme: Theme): CSSProperties {
	const week = getWeekDayStyles(date, setting.regulars, theme);
	const holiday = getHolidayStyles(date, setting.events, theme);

	return { ...week, ...holiday };
}
