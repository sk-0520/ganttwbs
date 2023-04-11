import { Timelines } from "@/models/Timelines";
import { Progress, TaskTimeline } from "@/models/data/Setting";
import { ChartProps } from "@/models/data/props/ChartProps";
import { NextPage } from "next";

interface Props extends ChartProps {
	currentTimeline: TaskTimeline;
	progress: Progress;
}

const Component: NextPage<Props> = (props: Props) => {

	const width = props.area.width;
	const height = props.area.height * 0.7;
	const x = props.area.x;
	const y = props.area.y + (props.area.height / 2 - height / 2);

	return (
		<g className={Timelines.toChartId(props.currentTimeline)}>
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
