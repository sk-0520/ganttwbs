import { FC } from "react";

import { ChartArea } from "@/models/data/ChartArea";
import { ColorString } from "@/models/data/Setting";

interface Props {
	area: ChartArea;
	color: ColorString;
}

const ErrorRow: FC<Props> = (props: Props) => {
	const padding = props.area.height * 0.2;

	return (
		<rect
			x={padding}
			y={props.area.y + padding}
			width={props.area.areaSize.width - padding * 2}
			height={props.area.height - padding * 2}
			fill={props.color}
			fillOpacity={0.6}
		/>
	);
};

export default ErrorRow;
