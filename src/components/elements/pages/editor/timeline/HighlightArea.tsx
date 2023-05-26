import { FC, ReactNode, useEffect, useMemo, useState } from "react";

import ColumnHighlight from "@/components/elements/pages/editor/timeline/highlight/ColumnHighlight";
import RowHighlight from "@/components/elements/pages/editor/timeline/highlight/RowHighlight";
import { useActiveTimelineIdAtomReader, useDragOverTimelineIdAtomReader, useDragSourceTimelineIdAtomReader, useHighlightDaysAtomReader, useHighlightDaysAtomWriter, useHighlightTimelineIdsAtomReader, useHighlightTimelineIdsAtomWriter, useHoverTimelineIdAtomReader } from "@/models/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useTotalTimelineMapAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { Charts } from "@/models/Charts";
import { ColumnHighlightMode, RowHighlightMode } from "@/models/data/Highlight";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Dom } from "@/models/Dom";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	//nop
}

const HighlightArea: FC<Props> = (props: Props) => {
	const activeTimelineIdAtomReader = useActiveTimelineIdAtomReader();
	const hoverTimelineIdAtomReader = useHoverTimelineIdAtomReader();
	const highlightTimelineIdsAtomReader = useHighlightTimelineIdsAtomReader();
	const highlightTimelineIdsAtomWriter = useHighlightTimelineIdsAtomWriter();
	const highlightDaysAtomReader = useHighlightDaysAtomReader();
	const highlightDaysAtomWriter = useHighlightDaysAtomWriter();
	const dragSourceTimelineIdAtomReader = useDragSourceTimelineIdAtomReader();
	const dragOverTimelineIdAtomReader = useDragOverTimelineIdAtomReader();
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
				timelineCallbacks={props.timelineCallbacks}
				callbackAnimationEnd={() => handleRowAnimationEnd(mode, timelineId)}
			/>
		);
	}

	function handleRowAnimationEnd(mode: RowHighlightMode, timelineId: TimelineId): void {
		if (mode === "highlight") {
			highlightTimelineIdsAtomWriter.write(c => c.filter(a => a !== timelineId));
		}
	}

	function handleColumnAnimationEnd(mode: ColumnHighlightMode, date: DateTime): void {
		if (mode === "highlight") {
			highlightDaysAtomWriter.write(c => c.filter(a => !a.equals(date)));
		}
	}

	return (
		<div id="highlight-area">
			{highlightTimelineIdsAtomReader.data.map(a => {
				return renderRowHighlight(a, "highlight", a);
			})}
			{highlightDaysAtomReader.data.map(a => {
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
			{hoverTimelineIdAtomReader.data && renderRowHighlight(hoverTimelineIdAtomReader.data, "hover")}
			{dragOverTimelineIdAtomReader.data && renderRowHighlight(dragOverTimelineIdAtomReader.data, "drag-over")}
			{dragSourceTimelineIdAtomReader.data && renderRowHighlight(dragSourceTimelineIdAtomReader.data, "drag-source")}
			{activeTimelineIdAtomReader.data && renderRowHighlight(activeTimelineIdAtomReader.data, "active")}
		</div>
	);
};

export default HighlightArea;
