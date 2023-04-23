
import { FC } from "react";

import HighlightTimeline from "@/components/elements/pages/editor/timeline/draw/HighlightTimeline";
import { Calendars } from "@/models/Calendars";
import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";


interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {
	//nop
}

const DrawArea: FC<Props> = (props: Props) => {

	const crossHeader = document.getElementById("cross-header");
	if (!crossHeader) {
		return null;
	}

	const days = Calendars.getCalendarRangeDays(props.calendarInfo.range);
	const cell = props.configuration.design.honest.cell;
	const highlightAreaSize: AreaSize = {
		width: crossHeader.clientWidth + cell.width.value * days,
		height: cell.height.value * props.timelineStore.totalItemMap.size,
	};

	return (
		<svg
			id="highlight"
			width={highlightAreaSize.width}
			height={highlightAreaSize.height}
		>
			<HighlightTimeline
				configuration={props.configuration}
				calendarInfo={props.calendarInfo}
				highlight="hover"
				areaSize={highlightAreaSize}
				timelineStore={props.timelineStore}
			/>
		</svg>
	);
};

export default DrawArea;
