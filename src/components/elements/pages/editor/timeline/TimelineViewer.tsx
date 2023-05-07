import { FC, ReactNode, useMemo } from "react";

import GanttChartTimeline from "@/components/elements/pages/editor/timeline/GanttChartTimeline";
import ConnectorTimeline from "@/components/elements/pages/editor/timeline/shape/ConnectorTimeline";
import { Calendars } from "@/models/Calendars";
import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { ColorString } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";

interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps, CalendarInfoProps, ResourceInfoProps {
	//nop
}

const TimelineViewer: FC<Props> = (props: Props) => {

	const { cell, days } = useMemo(() => {
		const cell = props.configuration.design.seed.cell;
		const days = Calendars.getCalendarRangeDays(props.calendarInfo.range);
		return {
			cell,
			days,
		};
	}, [props.configuration, props.calendarInfo]);

	const chartSize = useMemo(() => {
		const result: AreaSize = {
			width: cell.width.value * days,
			height: cell.height.value * props.timelineStore.totalItemMap.size,
		};
		return result;
	}, [cell, days, props.timelineStore.totalItemMap.size]);


	const gridNodes = useMemo(() => {
		const width = cell.width.value * (days + props.configuration.design.dummy.width);
		const height = cell.height.value * (props.timelineStore.totalItemMap.size + props.configuration.design.dummy.height);

		// 横軸
		const gridHorizontals = new Array<ReactNode>();
		for (let i = 0; i < (props.timelineStore.totalItemMap.size + props.configuration.design.dummy.height); i++) {
			const y = cell.height.value + cell.height.value * i;
			gridHorizontals.push(
				<line
					key={i}
					x1={0}
					x2={width}
					y1={y - 0.5}
					y2={y - 0.5}
					stroke="black"
					strokeWidth={1}
					strokeDasharray={1}
				/>
			);
		}

		// 縦軸
		const gridHolidays = new Array<ReactNode>();
		const gridVerticals = new Array<ReactNode>();
		for (let i = 0; i < (days + props.configuration.design.dummy.width); i++) {
			const date = props.calendarInfo.range.begin.add(TimeSpan.fromDays(i));

			const gridX = cell.width.value + cell.width.value * i;

			gridVerticals.push(
				<line
					key={i}
					x1={gridX - 0.5}
					x2={gridX - 0.5}
					y1={0}
					y2={height}
					stroke="gray"
					strokeWidth={1}
					strokeDasharray={1.5}
				/>
			);

			if (days < i) {
				// 曜日とかの判定すらもういらない
				continue;
			}

			let color: ColorString | undefined = undefined;

			// 祝日判定
			const holidayEventValue = Calendars.getHolidayEventValue(date, props.calendarInfo.holidayEventMap);
			if (holidayEventValue) {
				color = props.setting.theme.holiday.events[holidayEventValue.event.kind];
			}
			// 曜日判定
			if (!color) {
				const week = Settings.toWeekDay(date.week);
				if (props.setting.calendar.holiday.regulars.includes(week)) {
					color = props.setting.theme.holiday.regulars[week];
				}
			}
			if (color) {
				const holidayX = cell.width.value * i;

				gridHolidays.push(
					<rect
						key={holidayX}
						x={holidayX}
						y={0}
						width={cell.width.value}
						height={height}
						fill={color}
					/>
				);
			}
		}

		return (
			<g>
				<g>
					{gridHolidays.map(a => a)}
				</g>
				<g>
					{gridHorizontals.map(a => a)}
				</g>
				<g>
					{gridVerticals.map(a => a)}
				</g>
			</g>
		);
	}, [cell, days, props.calendarInfo, props.configuration, props.setting, props.timelineStore.totalItemMap.size]);

	return (
		<div id="viewer">
			<svg
				id="canvas"
				width={(chartSize.width + (cell.width.value * props.configuration.design.dummy.width)) + "px"}
				height={(chartSize.height + (cell.height.value * (props.configuration.design.dummy.height - 1))) + "px"}
			>
				{gridNodes}
				{props.timelineStore.sequenceItems.map((a, i) => {
					return (
						<GanttChartTimeline
							key={a.id}
							configuration={props.configuration}
							setting={props.setting}
							parentGroup={null}
							currentTimeline={a}
							currentIndex={i}
							calendarInfo={props.calendarInfo}
							resourceInfo={props.resourceInfo}
							chartSize={chartSize}
							timelineStore={props.timelineStore}
						/>
					);
				})}
				{props.timelineStore.sequenceItems.map((a, i) => {
					if (!Settings.maybeTaskTimeline(a)) {
						return null;
					}
					return (
						<ConnectorTimeline
							key={a.id}
							configuration={props.configuration}
							setting={props.setting}
							currentTimeline={a}
							currentIndex={i}
							calendarInfo={props.calendarInfo}
							resourceInfo={props.resourceInfo}
							chartSize={chartSize}
							timelineStore={props.timelineStore}
						/>
					);
				})}
			</svg>

		</div>
	);
};

export default TimelineViewer;
