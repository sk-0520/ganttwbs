import { ChartProps } from "@/models/data/props/ChartProps";
import { NextPage } from "next";

interface Props extends ChartProps {
}

const Component: NextPage<Props> = (props: Props) => {

	const width = props.area.width;
	const height = props.area.height * 0.4;
	const x = props.area.x;
	const y = props.area.y + (props.area.height / 2 - height / 2);

	return (
		<>
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={props.background}
				stroke={props.borderColor}
				strokeWidth={props.borderThickness}
			/>
		</>
	);
};

export default Component;
