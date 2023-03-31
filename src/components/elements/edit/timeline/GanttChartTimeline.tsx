import { EditProps } from "@/models/data/props/EditProps";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { TimeLineEditorProps } from "@/models/data/props/TimeLineEditorProps";
import { GroupTimeline, Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { SuccessTimeRange, TimeRanges } from "@/models/TimeRange";
import { TimeSpan } from "@/models/TimeSpan";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import TaskChart from "./chart/TaskChart";
import { ChartArea } from "@/models/data/ChartArea";

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

		const x = startDiffDays * cell.width.value;
		const y = props.currentIndex * cell.height.value;
		const width = endDiffDays * cell.width.value;
		const height = cell.height.value;

		const area: ChartArea = {
			x: x,
			y: y,
			width: width,
			height: height,
		};

		console.debug(props.currentTimeline.id, startDiffDays);

		return (
			<>
				{
					Settings.maybeTaskTimeline(props.currentTimeline)
						? (
							<TaskChart
								configuration={props.configuration}
								background="#ff0000"
								foreground={props.editData.setting.theme.timeline.completed}
								borderColor="#000000"
								borderThickness={1}
								area={area}
								progress={props.currentTimeline.progress}
							/>
						) : (
							<></>
						)
				}
				<>
					<text
						x={x + cell.height.value}
						y={y + (cell.height.value / 2)}
					>
						{props.currentTimeline.id}/{props.currentIndex}
					</text>

					{/* <text y={y + (cell.height.value / 2)}>{props.currentTimeline.id}@{x}:{y}</text> */}
				</>
			</>
		)
	}

	return (
		<>
			{renderCurrentTimeline()}
		</>
	);
};

export default Component;
