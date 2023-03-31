import { Design } from "@/models/data/Design";
import { EditProps } from "@/models/data/props/EditProps";
import { Group, Member, MemberId, Timeline, TimelineId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeRange } from "@/models/TimeRange";
import { NextPage } from "next";
import GanttChartTimeline from "./GanttChartTimeline";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { TimeSpan } from "@/models/TimeSpan";
import { ReactNode } from "react";

interface Props extends EditProps {
	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const range = {
		from: new Date(props.editData.setting.calendar.range.from),
		to: new Date(props.editData.setting.calendar.range.to),
	}

	const cell = props.configuration.design.honest.cell;
	const timelines = props.editData.setting.timelineNodes.flatMap(a => flat(a));

	const box = {
		width: cell.width.value * TimeSpan.fromMilliseconds(range.to.getTime() - range.from.getTime()).totalDays,
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

		const rangeSpan = TimeSpan.fromMilliseconds(range.to.getTime() - range.from.getTime());
		const rangeDays = rangeSpan.totalDays;

		const width = cell.width.value * rangeDays;
		//const height = cell.height.value * props.timeRanges.size;

		const gridHorizontals = new Array<ReactNode>();
		for (let i = 0; i < props.timeRanges.size; i++) {
			const y = cell.height.value * i;
			gridHorizontals.push(
				<line
					x1={0}
					x2={width}
					y1={y}
					y2={y}
					stroke="black"
					strokeWidth={1}
				/>
			)
		}

		//const gridVericals = new Array<ReactNode>();


		return (
			<>
				<g>
					{gridHorizontals.map(a => a)}
				</g>
			</>
		)
	}

	return (
		<div id='viewer'>
			<svg width={box.width} height={box.height}>
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
