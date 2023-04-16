import { NextPage } from "next";

import { ChartProps } from "@/models/data/props/ChartProps";
import { Progress, TaskTimeline } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";


interface Props extends ChartProps {
	currentTimeline: TaskTimeline;
	progress: Progress;
}

const Component: NextPage<Props> = (props: Props) => {

	if (!props.area.timeSpanRange) {
		const padding = props.area.height * 0.2;

		return (
			<g>
				<rect
					x={padding}
					y={props.area.y + padding}
					width={props.area.chartSize.width - padding * 2}
					height={props.area.height - padding * 2}
					fill="red"
					fillOpacity={0.6}
				/>
			</g>
		);
	}

	const width = props.area.width;
	const height = props.area.height * 0.7;
	const x = props.area.x;
	const y = props.area.y + (props.area.height / 2 - height / 2);

	return (
		<g id={Timelines.toChartId(props.currentTimeline)}>
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={props.background}
				stroke={props.borderColor}
				strokeWidth={props.borderThickness}
				paintOrder="stroke"
			/>

			<rect
				x={x}
				y={y + height * 0.1}
				width={width * props.progress}
				height={height * 0.8}
				fill={props.foreground}
			/>
		</g>
	);
};

export default Component;
