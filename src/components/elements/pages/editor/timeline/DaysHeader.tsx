import { FC, useMemo } from "react";

import InformationDay from "@/components/elements/pages/editor/timeline/days/InformationDay";
import { useLocale } from "@/locales/locale";
import { Arrays } from "@/models/Arrays";
import { useHoverTimelineIdAtomWriter } from "@/models/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useSettingAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { Calendars } from "@/models/Calendars";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { DateTime } from "@/models/DateTime";
import { Days } from "@/models/Days";
import { createLogger } from "@/models/Logging";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";

const logger = createLogger("DaysHeader");

interface Props extends ConfigurationProps, TimelineCallbacksProps {
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

	const settingAtomReader = useSettingAtomReader();
	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const { dates, yearMonthBucket } = useMemo(() => {
		logger.debug("DaysHeader - dates", new Date());
		const days = Calendars.getCalendarRangeDays(calendarInfoAtomReader.data.range);
		const dates = Arrays
			.range(0, days)
			.map(a => calendarInfoAtomReader.data.range.begin.add(TimeSpan.fromDays(a)))
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
	}, [calendarInfoAtomReader.data]);

	const yearMonthNodes = useMemo(() => {
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
		return dates.map(a => {
			const holidayEventValue = calendarInfoAtomReader.data.holidayEventMap.get(a.ticks);
			const classNames = Days.getDayClassNames(a, settingAtomReader.data.calendar.holiday.regulars, holidayEventValue, settingAtomReader.data.theme);
			const className = Days.getCellClassName(classNames);

			return (
				<td key={a.ticks} id={Timelines.toDaysId(a)} title={holidayEventValue?.event.display} className={className}>
					<time dateTime={a.toHtml("time")}>{a.day}</time>
				</td>
			);
		});
	}, [dates, calendarInfoAtomReader.data, settingAtomReader.data]);

	const weekNodes = useMemo(() => {
		return dates.map(a => {
			const holidayEventValue = calendarInfoAtomReader.data.holidayEventMap.get(a.ticks);
			const classNames = Days.getDayClassNames(a, settingAtomReader.data.calendar.holiday.regulars, holidayEventValue, settingAtomReader.data.theme);
			const className = Days.getCellClassName(classNames);

			return (
				<td key={a.ticks} title={holidayEventValue?.event.display} className={className}>
					{locale.common.calendar.week.short[Settings.toWeekDay(a.week)]}
				</td>
			);
		});
	}, [dates, locale, calendarInfoAtomReader.data, settingAtomReader.data]);

	const dummyNodes = useMemo(() => {
		const className = Days.getCellClassName([]);

		return {
			yearMonth: (
				<td colSpan={props.configuration.design.dummy.width} className="cell _dynamic_design_cell">
					<time dateTime={"invalid"}>
						{locale.pages.editor.timeline.header.dummy}
					</time>
				</td>
			),
			columns: Arrays.range(0, props.configuration.design.dummy.width).map(a => {
				return <td key={a} className={className}>&nbsp;</td>;
			}),
		};
	}, [locale, props.configuration.design.dummy.width]);

	function handleMouseEnter() {
		hoverTimelineIdAtomWriter.write(undefined);
	}

	return (
		<div
			id="days-header"
			onMouseEnter={handleMouseEnter}
		>
			<table>
				<tbody>
					<tr className="year-month">
						{yearMonthNodes}
						{dummyNodes.yearMonth}
					</tr>
					<tr className="day">
						{dayNodes}
						{dummyNodes.columns}
					</tr>
					<tr className="week">
						{weekNodes}
						{dummyNodes.columns}
					</tr>
					<tr className="information">
						{dates.map(a => {
							return (
								<InformationDay
									key={a.ticks}
									date={a}
									timelineCallbacks={props.timelineCallbacks}
								/>
							);
						})}
						{dummyNodes.columns}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default DaysHeader;

