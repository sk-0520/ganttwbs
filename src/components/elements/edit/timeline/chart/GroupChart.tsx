import { ChartProps } from "@/models/data/props/ChartProps";
import { NextPage } from "next";

interface Props extends ChartProps {
}

const Component: NextPage<Props> = (props: Props) => {

	const width = props.area.width;
	const height = props.area.height * 0.2;
	const x = props.area.x;
	const y = props.area.y + (props.area.height / 2 - height / 2);

	return (
		<>
			<g>
				<rect
					x={0}
					y={props.area.y}
					width={props.area.chartSize.width}
					height={props.area.height}
					fill={props.background}
					fillOpacity={0.3}
				/>

				<rect
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
				/>
			</g>
		</>
	);
};

export default Component;
