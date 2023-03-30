import { EditProps } from "@/models/data/props/EditProps";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { TimeLineEditorProps } from "@/models/data/props/TimeLineEditorProps";
import { GroupTimeline, Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { SuccessTimeRange, TimeRanges } from "@/models/TimeRange";
import { TimeSpan } from "@/models/TimeSpan";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";

interface Props extends GanttChartTimelineProps { }

const Component: NextPage<Props> = (props: Props) => {

	const [timeRange, setTimeRange] = useState<SuccessTimeRange | null>();

	useEffect(() => {
		const tr = props.timeRanges.get(props.currentTimeline.id);
		if (tr) {
			if (TimeRanges.maybeSuccessTimeRange(tr)) {
				setTimeRange(tr);
			} else {
				setTimeRange(null);
			}
		}
	}, [props.timeRanges]);

	function renderCurrentTimeline(): ReactNode {
		if (!timeRange) {
			return <></>
		}

		const cell = props.configuration.design.honest.cell;

		const diffTime = timeRange.begin.getTime() - props.range.from.getTime();
		const diffSpan = TimeSpan.fromMilliseconds(diffTime);
		const diffDays = diffSpan.totalDays;

		const x = diffDays * cell.width.value;
		const y = props.currentIndex * cell.height.value;

		console.debug(props.currentTimeline.id, diffDays)

		return (
			<>
				<rect
					x={x}
					y={y}
					width={10}
					height={10}
				/>
				<text
					x={x + cell.height.value}
					y={y + (cell.height.value / 2)}
				>
					{props.currentTimeline.id}/{props.currentIndex}
				</text>


				<text y={y+ (cell.height.value / 2)}>{props.currentTimeline.id}@{x}:{y}</text>
			</>
		)
	}

	return (
		<>
			{renderCurrentTimeline()}
			{/* {Settings.maybeGroupTimeline(props.currentTimeline) && props.currentTimeline.children.map((a, i) => {
				return (
					<Component
						key={a.id}
						configuration={props.configuration}
						editData={props.editData}
						parentGroup={props.currentTimeline as GroupTimeline}
						currentTimeline={a}
						currentIndex={i}
						range={props.range}
						timeRanges={props.timeRanges}
						updateRelations={props.updateRelations}
					/>
				);
			})} */}
		</>
	);
};

export default Component;
