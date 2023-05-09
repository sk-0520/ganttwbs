import { FC, useEffect, useMemo, useState } from "react";

import RowHighlight from "@/components/elements/pages/editor/timeline/highlight/RowHighlight";
import { Charts } from "@/models/Charts";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { HighlightValueStoreProps } from "@/models/data/props/HighlightStoreProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, HighlightValueStoreProps, TimelineStoreProps {

}

const HighlightArea: FC<Props> = (props: Props) => {

	const [crossHeaderWidth, setCrossHeaderWidth] = useState(0);

	useEffect(() => {
		const crossHeaderElement = document.getElementById("cross-header");
		if (crossHeaderElement) {
			setCrossHeaderWidth(crossHeaderElement.clientWidth);
		}
	}, []);

	const areaData = useMemo(() => {
		return Charts.createAreaData(props.configuration.design.seed.cell, props.calendarInfo.range, props.timelineStore.totalItemMap.size);
	}, [props.configuration, props.calendarInfo, props.timelineStore.totalItemMap.size]);

	return (
		<div id="highlight-area">
			{props.highlightValueStore.hoverTimelineId && (
				<RowHighlight
					configuration={props.configuration}
					mode="hover"
					timelineId={props.highlightValueStore.hoverTimelineId}
					areaData={areaData}
					crossHeaderWidth={crossHeaderWidth}
					timelineStore={props.timelineStore}
				/>
			)}
			{props.highlightValueStore.activeTimelineId && (
				<RowHighlight
					configuration={props.configuration}
					mode="active"
					timelineId={props.highlightValueStore.activeTimelineId}
					areaData={areaData}
					crossHeaderWidth={crossHeaderWidth}
					timelineStore={props.timelineStore}
				/>
			)}
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
		</div>
	);
};

export default HighlightArea;
