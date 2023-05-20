import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { AreaData } from "@/models/data/Area";
import { useCalendarInfoAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { ColumnHighlightMode } from "@/models/data/Highlight";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { DateTime } from "@/models/DateTime";

interface Props extends ConfigurationProps {
	mode: ColumnHighlightMode;
	date: DateTime;
	areaData: AreaData;
	crossHeaderWidth: number;
	crossHeaderHeight: number;
	callbackAnimationEnd(): void;
}

const RowHighlight: FC<Props> = (props: Props) => {
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const targetDay = calendarInfoAtomReader.data.range.begin.diff(props.date.toDateOnly()).totalDays;

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
			onAnimationEnd={props.callbackAnimationEnd}
		/>
	);
};

export default RowHighlight;
