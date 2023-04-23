
import { FC } from "react";

import HighlightTimeline from "@/components/elements/pages/editor/timeline/draw/HighlightTimeline";
import { Calendars } from "@/models/Calendars";
import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { Configuration } from "@/models/data/Configuration";
import { EditorData } from "@/models/data/EditorData";
import { TimelineStore } from "@/models/store/TimelineStore";
import { SettingProps } from "@/models/data/props/SettingProps";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";


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
