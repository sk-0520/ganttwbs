import { useAtomValue } from "jotai";
import { FC, useEffect, useMemo, useState } from "react";

import ColumnHighlight from "@/components/elements/pages/editor/timeline/highlight/ColumnHighlight";
import RowHighlight from "@/components/elements/pages/editor/timeline/highlight/RowHighlight";
import { Charts } from "@/models/Charts";
import { ActiveTimelineIdAtom, HighlightDaysAtom, HighlightTimelineIdsAtom, HoverTimelineIdAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {

}

const HighlightArea: FC<Props> = (props: Props) => {

	const activeTimelineId = useAtomValue(ActiveTimelineIdAtom);
	const hoverTimelineId = useAtomValue(HoverTimelineIdAtom);
	const highlightTimelineIds = useAtomValue(HighlightTimelineIdsAtom);
	const highlightDays = useAtomValue(HighlightDaysAtom);

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

	return (
		<div id="highlight-area">
			{highlightTimelineIds.map(a => {
				return (
					<RowHighlight
						key={a}
						configuration={props.configuration}
						mode="highlight"
						timelineId={a}
						areaData={areaData}
						crossHeaderWidth={crossHeaderWidth}
						timelineStore={props.timelineStore}
					/>
				);
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
			{hoverTimelineId && (
				<RowHighlight
					configuration={props.configuration}
					mode="hover"
					timelineId={hoverTimelineId}
					areaData={areaData}
					crossHeaderWidth={crossHeaderWidth}
					timelineStore={props.timelineStore}
				/>
			)}
			{activeTimelineId && (
				<RowHighlight
					configuration={props.configuration}
					mode="active"
					timelineId={activeTimelineId}
					areaData={areaData}
					crossHeaderWidth={crossHeaderWidth}
					timelineStore={props.timelineStore}
				/>
			)}

		</div>
	);
};

export default HighlightArea;
