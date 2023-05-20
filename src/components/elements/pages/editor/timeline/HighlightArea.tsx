import { useAtom, useAtomValue } from "jotai";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

import ColumnHighlight from "@/components/elements/pages/editor/timeline/highlight/ColumnHighlight";
import RowHighlight from "@/components/elements/pages/editor/timeline/highlight/RowHighlight";
import { Charts } from "@/models/Charts";
import { ActiveTimelineIdAtom, DragOverTimelineIdAtom, DragSourceTimelineIdAtom, HighlightDaysAtom, HighlightTimelineIdsAtom, HoverTimelineIdAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useTotalTimelineMapAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { ColumnHighlightMode, RowHighlightMode } from "@/models/data/Highlight";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Dom } from "@/models/Dom";

interface Props extends ConfigurationProps, TimelineStoreProps {
	//nop
}

const HighlightArea: FC<Props> = (props: Props) => {
	const activeTimelineId = useAtomValue(ActiveTimelineIdAtom);
	const hoverTimelineId = useAtomValue(HoverTimelineIdAtom);
	const [highlightTimelineIds, setHighlightTimelineIds] = useAtom(HighlightTimelineIdsAtom);
	const [highlightDays, setHighlightDays] = useAtom(HighlightDaysAtom);
	const dragSourceTimelineId = useAtomValue(DragSourceTimelineIdAtom);
	const dragOverTimelineId = useAtomValue(DragOverTimelineIdAtom);
	const calendarInfoAtomReader = useCalendarInfoAtomReader();
	const totalTimelineMapAtomReader = useTotalTimelineMapAtomReader();

	const [crossHeaderWidth, setCrossHeaderWidth] = useState(0);
	const [crossHeaderHeight, setCrossHeaderHeight] = useState(0);

	useEffect(() => {
		const crossHeaderElement = Dom.getElementById("cross-header");
		setCrossHeaderWidth(crossHeaderElement.clientWidth);
		setCrossHeaderHeight(crossHeaderElement.clientHeight);
	}, []);

	const areaData = useMemo(() => {
		return Charts.createAreaData(props.configuration.design.seed.cell, calendarInfoAtomReader.data.range, totalTimelineMapAtomReader.data.size);
	}, [props.configuration, calendarInfoAtomReader.data.range, totalTimelineMapAtomReader.data.size]);

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
				callbackAnimationEnd={() => handleRowAnimationEnd(mode, timelineId)}
			/>
		);
	}

	function handleRowAnimationEnd(mode: RowHighlightMode, timelineId: TimelineId): void {
		if (mode === "highlight") {
			setHighlightTimelineIds(c => c.filter(a => a !== timelineId));
		}
	}

	function handleColumnAnimationEnd(mode: ColumnHighlightMode, date: DateTime): void {
		if (mode === "highlight") {
			setHighlightDays(c => c.filter(a => !a.equals(date)));
		}
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
						callbackAnimationEnd={() => handleColumnAnimationEnd("highlight", a)}
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
