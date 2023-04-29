
import { FC } from "react";

import { ChartProps } from "@/models/data/props/ChartProps";
import { GroupTimeline } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";



interface Props extends ChartProps {
	currentTimeline: GroupTimeline;
}

const GroupChart: FC<Props> = (props: Props) => {

	if (!props.area.timeSpanRange) {
		const padding = props.area.height * 0.2;

		return (
			<g>
				<rect
					x={0}
					y={props.area.y}
					width={props.area.areaSize.width}
					height={props.area.height}
					fill={props.background}
					fillOpacity={0.3}
				/>
				<rect
					x={padding}
					y={props.area.y + padding}
					width={props.area.areaSize.width - padding * 2}
					height={props.area.height - padding * 2}
					fill="yellow"
					fillOpacity={0.6}
				/>
			</g>
		);
	}

	const width = props.area.width;
	const height = props.area.height * 0.3;
	const x = props.area.x;
	const y = props.area.y + (props.area.height / 2 - height / 2);

	return (
		<g>
			<rect
				x={0}
				y={props.area.y}
				width={props.area.areaSize.width}
				height={props.area.height}
				fill={props.background}
				fillOpacity={0.3}
			/>
			<g>
				<rect
					id={Timelines.toChartId(props.currentTimeline)}
					x={x}
					y={y}
					width={width}
					height={height}
					fill={props.background}
					stroke={props.borderColor}
					strokeWidth={props.borderThickness}
					rx={height / 2}
					ry={width / 2}
					paintOrder="stroke"
					onDoubleClick={_ => props.timelineStore.startDetailEdit(props.currentTimeline)}
				/>

				<rect
					className="progress"
					x={x}
					y={y + height * 0.1}
					width={width * props.progress}
					height={height * 0.8}
					fill={props.foreground}
					rx={height / 2}
					ry={width / 2}
				/>
			</g>
		</g>
	);
};

export default GroupChart;
