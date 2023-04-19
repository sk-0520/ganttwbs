import { NextPage } from "next";
import { ReactNode } from "react";

import ConnectorTimeline from "@/components/elements/pages/editor/timeline/ConnectorTimeline";
import GanttChartTimeline from "@/components/elements/pages/editor/timeline/GanttChartTimeline";
import { Calendars } from "@/models/Calendars";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { AreaSize } from "@/models/data/AreaSize";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { EditProps } from "@/models/data/props/EditProps";
import { MemberId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { TimeSpan } from "@/models/TimeSpan";



interface Props extends EditProps {
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {

	const days = Calendars.getCalendarRangeDays(props.calendarInfo.range);

	const cell = props.configuration.design.honest.cell;

	const chartSize: AreaSize = {
		width: cell.width.value * days,
		height: cell.height.value * props.timelineStore.totalItemMap.size,
	};

	//TODO: for しなくてもできると思うけどパッと思いつかなんだ
	const memberMap = new Map<MemberId, MemberMapValue>();
	for (const group of props.editData.setting.groups) {
		for (const member of group.members) {
			memberMap.set(member.id, { group: group, member: member });
		}
	}

	function renderGrid(): ReactNode {

		const width = cell.width.value * days;
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
		for (let i = 0; i < days; i++) {
			const date = props.calendarInfo.range.from.add(TimeSpan.fromDays(i));

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
					strokeDasharray={2}
				/>
			);

			let color: string | undefined = undefined;

			// 祝日判定
			const holidayEventValue = Calendars.getHolidayEventValue(date, props.calendarInfo.holidayEventMap);
			if (holidayEventValue) {
				color = props.editData.setting.theme.holiday.events[holidayEventValue.event.kind];
			}
			// 曜日判定
			if (!color) {
				const week = Settings.toWeekDay(date.week);
				if (props.editData.setting.calendar.holiday.regulars.includes(week)) {
					color = props.editData.setting.theme.holiday.regulars[week];
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
	}

	return (
		<div id='viewer'>
			<svg id="canvas" width={chartSize.width} height={chartSize.height}>
				{renderGrid()}
				{props.timelineStore.sequenceItems.map((a, i) => {
					return (
						<GanttChartTimeline
							key={a.id}
							configuration={props.configuration}
							editData={props.editData}
							parentGroup={null}
							currentTimeline={a}
							currentIndex={i}
							calendarInfo={props.calendarInfo}
							chartSize={chartSize}
							memberMap={memberMap}
							updateRelations={props.updateRelations}
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
							editData={props.editData}
							currentTimeline={a}
							currentIndex={i}
							calendarInfo={props.calendarInfo}
							chartSize={chartSize}
							memberMap={memberMap}
							updateRelations={props.updateRelations}
							timelineStore={props.timelineStore}
						/>
					);
				})}
			</svg>

		</div>
	);
};

export default Component;
