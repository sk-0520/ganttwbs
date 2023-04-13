import { EditProps } from "@/models/data/props/EditProps";
import { MemberId, Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { NextPage } from "next";
import GanttChartTimeline from "./GanttChartTimeline";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { ReactNode, useRef } from "react";
import { ChartSize } from "@/models/data/ChartSize";
import { TimeSpan } from "@/models/TimeSpan";
import { TimelineStore } from "@/models/store/TimelineStore";
import { TimeZone } from "@/models/TimeZone";
import { CalendarRange } from "@/models/data/CalendarRange";
import { Timelines } from "@/models/Timelines";
import Xarrow from "react-xarrows";

interface Props extends EditProps {
	timeZone: TimeZone;
	calendarRange: CalendarRange;
	timelineStore: TimelineStore;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {

	const days = Timelines.getCalendarRangeDays(props.calendarRange);

	const cell = props.configuration.design.honest.cell;
	const timelines = props.editData.setting.timelineNodes.flatMap(a => flat(a));

	const refCanvas = useRef();

	const chartSize: ChartSize = {
		width: cell.width.value * days,
		height: cell.height.value * timelines.length,
	}

	//TODO: for しなくてもできると思うけどパッと思いつかなんだ
	const memberMap = new Map<MemberId, MemberMapValue>();
	for (const group of props.editData.setting.groups) {
		for (const member of group.members) {
			memberMap.set(member.id, { group: group, member: member });
		}
	}

	function flat(timeline: Timeline): Array<Timeline> {
		const result = new Array<Timeline>();

		if (Settings.maybeTaskTimeline(timeline)) {
			result.push(timeline);
		} else if (Settings.maybeGroupTimeline(timeline)) {
			result.push(timeline);
			const children = timeline.children.flatMap(a => flat(a));
			for (const child of children) {
				result.push(child);
			}
		}

		return result;
	}

	function renderGrid(): ReactNode {

		const width = cell.width.value * days;
		const height = cell.height.value * (timelines.length + props.configuration.design.dummy.height);

		// 横軸
		const gridHorizontals = new Array<ReactNode>();
		for (let i = 0; i < (timelines.length + props.configuration.design.dummy.height); i++) {
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
			)
		}

		// 縦軸
		const gridHolidays = new Array<ReactNode>();
		const gridVerticals = new Array<ReactNode>();
		for (let i = 0; i < days; i++) {
			const date = props.calendarRange.from.add(TimeSpan.fromDays(i));

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

			const dateText = date.format("yyyy-MM-dd");
			// 祝日判定
			if (dateText in props.editData.setting.calendar.holiday.events) {
				const holidayEvent = props.editData.setting.calendar.holiday.events[dateText];
				if (holidayEvent) {
					color = props.editData.setting.theme.holiday.events[holidayEvent.kind];
				}
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
				)
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
		)
	}

	//TODO: 関係各所のID要素が生成されてないと動かない問題
	function renderConnecters(): ReactNode {
		// const width = cell.width.value * days;
		// const height = cell.height.value * timelines.length;
		const canvas = document.getElementById("canvas");

		return timelines.map((a, i) => {
			if (!Settings.maybeTaskTimeline(a)) {
				return null;
			}

			if (!a.previous.length) {
				return null;
			}

			const currentChart = document.getElementById(Timelines.toChartId(a))
			if (!currentChart) {
				return null;
			}

			return a.previous.map(b => {
				return (
					<Xarrow
						key={b}
						start={Timelines.toChartId(b)}
						end={Timelines.toChartId(a)}
						startAnchor={"auto"}
						endAnchor={"left"}
						headShape={"arrow1"}
						headSize={4}
						strokeWidth={2}
						path={"smooth"}
					//dashness={true}
					/*
					divContainerStyle={{
						left: canvas?.clientWidth + "px",
						top: canvas?.clientHeight + "px",
						right: 0,
						bottom: 0,
						zIndex: -1
					}}
					*/
					/>
				)
			});
		});
	}

	return (
		<div id='viewer'>
			<svg id="canvas" width={chartSize.width} height={chartSize.height}>
				{renderGrid()}
				{timelines.map((a, i) => {
					return (
						<GanttChartTimeline
							key={a.id}
							configuration={props.configuration}
							editData={props.editData}
							parentGroup={null}
							currentTimeline={a}
							currentIndex={i}
							calendarRange={props.calendarRange}
							chartSize={chartSize}
							memberMap={memberMap}
							updateRelations={props.updateRelations}
							timelineStore={props.timelineStore}
						/>
					)
				})}
			</svg>
			<div id="connecters">
				{renderConnecters()}
			</div>

		</div>
	);
};

export default Component;

