
import { FC } from "react";

import ErrorRow from "@/components/elements/pages/editor/timeline/shape/ErrorRow";
import { useDetailEditTimelineAtomWriter } from "@/models/data/atom/editor/DragAndDropAtoms";
import { ChartProps } from "@/models/data/props/ChartProps";
import { TaskTimeline } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";

interface Props extends ChartProps {
	currentTimeline: TaskTimeline;
}

const TaskChart: FC<Props> = (props: Props) => {
	const detailEditTimelineAtomWriter = useDetailEditTimelineAtomWriter();

	if (!props.area.timeSpanRange) {
		return (
			<g>
				<ErrorRow
					area={props.area}
					color="red"
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
				onDoubleClick={_ => detailEditTimelineAtomWriter.write(props.currentTimeline)}
			/>

			<rect
				className="progress"
				x={x}
				y={y + height * 0.1}
				width={width * props.progress}
				height={height * 0.8}
				fill={props.foreground}
			/>
		</g>
	);
};

export default TaskChart;
