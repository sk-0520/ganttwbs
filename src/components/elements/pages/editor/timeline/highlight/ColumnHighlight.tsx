import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { AreaData } from "@/models/data/Area";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { DateTime } from "@/models/DateTime";

interface Props extends ConfigurationProps, CalendarInfoProps {
	mode: "highlight";
	date: DateTime;
	areaData: AreaData;
	crossHeaderWidth: number;
	crossHeaderHeight: number;
}

const RowHighlight: FC<Props> = (props: Props) => {

	const targetDay = props.calendarInfo.range.begin.diff(props.date.toDateOnly()).totalDays;

	if (props.areaData.days < targetDay) {
		return null;
	}

	const baseX = props.areaData.cell.height.value * targetDay;

	const style: CSSProperties = {
		left: `${props.crossHeaderWidth + baseX}px`,
		width: `${props.areaData.cell.width.value}px`,
		height: `${props.areaData.size.height - props.areaData.cell.height.value}px`, // TODO: 1個ズレてる！
	};

	return (
		<div
			className={
				classNames(
					"highlight-column",
					props.mode
				)
			}
			style={style}
		/>
	);
};

export default RowHighlight;
