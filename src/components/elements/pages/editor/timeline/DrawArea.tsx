import { NextPage } from "next";

import HighlightTimeline from "@/components/elements/pages/editor/timeline/draw/HighlightTimeline";
import { Calendars } from "@/models/Calendars";
import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { Configuration } from "@/models/data/Configuration";
import { EditorData } from "@/models/data/EditorData";
import { TimelineStore } from "@/models/store/TimelineStore";

interface Props {
	configuration: Configuration;
	editData: EditorData;
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {

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

export default Component;
