import { useAtomValue } from "jotai";
import { FC, useEffect, useMemo, useState } from "react";

import ColumnHighlight from "@/components/elements/pages/editor/timeline/highlight/ColumnHighlight";
import RowHighlight from "@/components/elements/pages/editor/timeline/highlight/RowHighlight";
import { Charts } from "@/models/Charts";
import { ActiveTimelineIdAtom, HoverTimelineIdAtom } from "@/models/data/atom/HighlightAtoms";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { HighlightValueStoreProps } from "@/models/data/props/HighlightStoreProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, HighlightValueStoreProps, TimelineStoreProps {

}

const HighlightArea: FC<Props> = (props: Props) => {

	const activeTimelineIdAtom = useAtomValue(ActiveTimelineIdAtom);
	const hoverTimelineIdAtom = useAtomValue(HoverTimelineIdAtom);

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
			{props.highlightValueStore.highlightTimelineIds.map(a => {
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
			{props.highlightValueStore.highlightDays.map(a => {
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
			{hoverTimelineIdAtom && (
				<RowHighlight
					configuration={props.configuration}
					mode="hover"
					timelineId={hoverTimelineIdAtom}
					areaData={areaData}
					crossHeaderWidth={crossHeaderWidth}
					timelineStore={props.timelineStore}
				/>
			)}
			{activeTimelineIdAtom && (
				<RowHighlight
					configuration={props.configuration}
					mode="active"
					timelineId={activeTimelineIdAtom}
					areaData={areaData}
					crossHeaderWidth={crossHeaderWidth}
					timelineStore={props.timelineStore}
				/>
			)}

		</div>
	);
};

export default HighlightArea;
