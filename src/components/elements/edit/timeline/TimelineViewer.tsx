import { EditProps } from "@/models/data/props/EditProps";
import { MemberId, Timeline, TimelineId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeRange } from "@/models/TimeRange";
import { NextPage } from "next";
import GanttChartTimeline from "./GanttChartTimeline";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { TimeSpan } from "@/models/TimeSpan";
import { ReactNode } from "react";
import { Strings } from "@/models/Strings";
import { ChartSize } from "@/models/data/ChartSize";

interface Props extends EditProps {
	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const range = {
		from: new Date(props.editData.setting.calendar.range.from),
		to: new Date(props.editData.setting.calendar.range.to),
	}
	const diff = TimeSpan.diff(range.to, range.from);
	const days = diff.totalDays + 1;

	const cell = props.configuration.design.honest.cell;
	const timelines = props.editData.setting.timelineNodes.flatMap(a => flat(a));

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
		const height = cell.height.value * timelines.length;

		const gridHorizontals = new Array<ReactNode>();
		for (let i = 0; i < props.timeRanges.size; i++) {
			const y = cell.height.value + cell.height.value * i;
			gridHorizontals.push(
				<line
					x1={0}
					x2={width}
					y1={y + 0.5}
					y2={y + 0.5}
					stroke="black"
					strokeWidth={1}
					strokeDasharray={1}
				/>
			)
		}

		const gridHolidays = new Array<ReactNode>();
		const gridVerticals = new Array<ReactNode>();
		for (let i = 0; i < days; i++) {
			const date = new Date(range.from.getTime());
			date.setDate(date.getDate() + i);

			const gridX = cell.width.value + cell.width.value * i;

			gridVerticals.push(
				<line
					x1={gridX - 0.5}
					x2={gridX - 0.5}
					y1={0}
					y2={height}
					stroke="gray"
					strokeWidth={1}
					strokeDasharray={2}
				/>
			);

			let color: string | null = null;

			console.log("<DATE>", date);
			const dateText = Strings.formatDate(date, "yyyy-MM-dd");
			if (dateText in props.editData.setting.calendar.holiday.events) {
				const holidayEvent = props.editData.setting.calendar.holiday.events[dateText];
				if (holidayEvent) {
					color = props.editData.setting.theme.holiday.events[holidayEvent.kind];
				}
			}
			if (!color) {
				const week = Settings.toWeekDay(date.getDay());
				if (props.editData.setting.calendar.holiday.regulars.includes(week)) {
					color = props.editData.setting.theme.holiday.regulars[week] ?? null;
					console.debug(123);
				}
			}
			if (color) {
				const holidayX = cell.width.value * i;

				gridHolidays.push(
					<rect
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

	return (
		<div id='viewer'>
			<svg width={chartSize.width} height={chartSize.height}>
				<>
					{renderGrid()}
				</>
				{timelines.map((a, i) => {
					return (
						<GanttChartTimeline
							key={a.id}
							configuration={props.configuration}
							editData={props.editData}
							parentGroup={null}
							currentTimeline={a}
							currentIndex={i}
							range={range}
							chartSize={chartSize}
							memberMap={memberMap}
							timeRanges={props.timeRanges}
							updateRelations={props.updateRelations}
						/>
					)
				})}
			</svg>
		</div>
	);
};

export default Component;
