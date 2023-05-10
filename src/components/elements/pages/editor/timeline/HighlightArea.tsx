import { useAtomValue } from "jotai";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

import ColumnHighlight from "@/components/elements/pages/editor/timeline/highlight/ColumnHighlight";
import RowHighlight from "@/components/elements/pages/editor/timeline/highlight/RowHighlight";
import { Charts } from "@/models/Charts";
import { ActiveTimelineIdAtom, DragOverTimelineIdAtom, DragSourceTimelineIdAtom, HighlightDaysAtom, HighlightTimelineIdsAtom, HoverTimelineIdAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { RowHighlightMode } from "@/models/data/Highlight";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { TimelineId } from "@/models/data/Setting";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {

}

const HighlightArea: FC<Props> = (props: Props) => {

	const activeTimelineId = useAtomValue(ActiveTimelineIdAtom);
	const hoverTimelineId = useAtomValue(HoverTimelineIdAtom);
	const highlightTimelineIds = useAtomValue(HighlightTimelineIdsAtom);
	const highlightDays = useAtomValue(HighlightDaysAtom);
	const dragSourceTimelineId = useAtomValue(DragSourceTimelineIdAtom);
	const dragOverTimelineId = useAtomValue(DragOverTimelineIdAtom);


	const [crossHeaderWidth, setCrossHeaderWidth] = useState(0);
	const [crossHeaderHeight, setCrossHeaderHeight] = useState(0);

	useEffect(() => {
		const crossHeaderElement = document.getElementById("cross-header");
		if (crossHeaderElement) {
			setCrossHeaderWidth(crossHeaderElement.clientWidth);
			setCrossHeaderHeight(crossHeaderElement.clientHeight);
		}
	}, []);

	const areaData = useMemo(() => {
		return Charts.createAreaData(props.configuration.design.seed.cell, props.calendarInfo.range, props.timelineStore.totalItemMap.size);
	}, [props.configuration, props.calendarInfo, props.timelineStore.totalItemMap.size]);

	function renderRowHighlight(timelineId: TimelineId, mode: RowHighlightMode, key?: string): ReactNode {
		return (
			<RowHighlight
				key={key}
				configuration={props.configuration}
				mode={mode}
				timelineId={timelineId}
				areaData={areaData}
				crossHeaderWidth={crossHeaderWidth}
				timelineStore={props.timelineStore}
			/>
		);
	}

	return (
		<div id="highlight-area">
			{highlightTimelineIds.map(a => {
				return renderRowHighlight(a, "highlight", a);
			})}
			{highlightDays.map(a => {
				return (
					<ColumnHighlight
						key={a.ticks}
						configuration={props.configuration}
						mode="highlight"
						date={a}
						areaData={areaData}
						crossHeaderWidth={crossHeaderWidth}
						crossHeaderHeight={crossHeaderHeight}
						calendarInfo={props.calendarInfo}
					/>
				);
			})}
			{hoverTimelineId && renderRowHighlight(hoverTimelineId, "hover")}
			{dragOverTimelineId && renderRowHighlight(dragOverTimelineId, "drag-over")}
			{dragSourceTimelineId && renderRowHighlight(dragSourceTimelineId, "drag-source")}
			{activeTimelineId && renderRowHighlight(activeTimelineId, "active")}
		</div>
	);
};

export default HighlightArea;
