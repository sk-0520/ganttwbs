import { FC } from "react";

import RangeViewer from "@/components/elements/pages/editor/analytics/RangeViewer";
import WorkViewer from "@/components/elements/pages/editor/analytics/WorkViewer";
import { Calendars } from "@/models/Calendars";
import { EditorData } from "@/models/data/EditorData";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { Resources } from "@/models/Resources";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends ConfigurationProps {
	isVisible: boolean;
	editorData: EditorData;
}

const AnalyticsViewer: FC<Props> = (props: Props) => {
	if (!props.isVisible) {
		return <></>;
	}

	const calendarInfo = Calendars.createCalendarInfo(props.editorData.setting.timeZone, props.editorData.setting.calendar);
	const resourceInfo = Resources.createResourceInfo(props.editorData.setting.groups);
	const sequenceTimelines = Timelines.flat(props.editorData.setting.rootTimeline.children);
	const timelineMap = Timelines.getTimelinesMap(props.editorData.setting.rootTimeline);
	const workRanges = Timelines.getWorkRanges([...timelineMap.values()], props.editorData.setting.calendar.holiday, props.editorData.setting.recursive, calendarInfo.timeZone);
	const dayInfos = Timelines.calcDayInfos(timelineMap, new Set([...workRanges.values()]), resourceInfo);

	console.debug("calendarInfo", calendarInfo);
	console.debug("resourceInfo", resourceInfo);
	console.debug("sequenceTimelines", sequenceTimelines);
	console.debug("timelineMap", timelineMap);
	console.debug("workRanges", workRanges);
	console.debug("dayInfos", dayInfos);

	const successWorkRanges = [...workRanges.values()].filter(WorkRanges.maybeSuccessWorkRange);
	const totalSuccessWorkRange = WorkRanges.getTotalSuccessWorkRange(successWorkRanges);

	return (
		<div id="analytics">
			<RangeViewer
				calendarInfo={calendarInfo}
				totalSuccessWorkRange={totalSuccessWorkRange}
			/>
			<WorkViewer
				calendarInfo={calendarInfo}
				resourceInfo={resourceInfo}
				sequenceTimelines={sequenceTimelines}
				totalSuccessWorkRange={totalSuccessWorkRange}
			/>
		</div>
	);
};

export default AnalyticsViewer;
