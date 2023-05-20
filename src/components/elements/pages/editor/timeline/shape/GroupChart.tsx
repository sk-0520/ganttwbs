
import { FC, useMemo } from "react";

import ErrorRow from "@/components/elements/pages/editor/timeline/shape/ErrorRow";
import { useDetailEditTimelineAtomWriter } from "@/models/data/atom/editor/DragAndDropAtoms";
import { ChartProps } from "@/models/data/props/ChartProps";
import { GroupTimeline } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";


interface Props extends ChartProps {
	currentTimeline: GroupTimeline;
}

const GroupChart: FC<Props> = (props: Props) => {
	const detailEditTimelineAtomWriter = useDetailEditTimelineAtomWriter();

	const groupRowNodes = useMemo(() => {
		return (
			<rect
				x={0}
				y={props.area.y}
				width={props.area.areaSize.width}
				height={props.area.height}
				fill={props.background}
				fillOpacity={0.3}
			/>
		);
	}, [props.area.areaSize.width, props.area.height, props.area.y, props.background]);

	if (!props.area.timeSpanRange) {
		return (
			<g>
				{groupRowNodes}
				<ErrorRow
					area={props.area}
					color="yellow"
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
			{groupRowNodes}
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
					onDoubleClick={_ => detailEditTimelineAtomWriter.write(props.currentTimeline)}
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
