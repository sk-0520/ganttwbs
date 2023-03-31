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

		const startDiffTime = timeRange.begin.getTime() - props.range.from.getTime();
		const startDiffSpan = TimeSpan.fromMilliseconds(startDiffTime);
		const startDiffDays = startDiffSpan.totalDays;

		const endDiffTime = timeRange.end.getTime() - timeRange.begin.getTime();
		const endDiffSpan = TimeSpan.fromMilliseconds(endDiffTime);
		const endDiffDays = endDiffSpan.totalDays;

		const height = cell.height.value * 0.8;
		const width = endDiffDays * cell.width.value;
		const x = startDiffDays * cell.width.value;
		const y = props.currentIndex * cell.height.value + (cell.height.value / 2 - height / 2);

		console.debug(props.currentTimeline.id, startDiffDays)

		return (
			<>
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
				/>
				<text
					x={x + cell.height.value}
					y={y + (cell.height.value / 2)}
				>
					{props.currentTimeline.id}/{props.currentIndex}
				</text>


				<text y={y + (cell.height.value / 2)}>{props.currentTimeline.id}@{x}:{y}</text>
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
