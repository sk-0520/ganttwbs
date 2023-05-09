import classNames from "classnames";
import { FC, ReactNode, useEffect, useState } from "react";

import { SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { HighlightCallbackStoreProps } from "@/models/data/props/HighlightStoreProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

interface Props extends TimelineStoreProps, HighlightCallbackStoreProps {
	level: number;
	currentTimeline: AnyTimeline;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	children: ReactNode;
}

const TimelineHeaderRow: FC<Props> = (props: Props) => {

	const [dropEventClassName, setDropEventClassName] = useState("");

	useEffect(() => {
		if (!props.draggingTimeline) {
			setDropEventClassName("");
		}
	}, [props.draggingTimeline]);

	function handleDragOver() {
		setDropEventClassName("drag-over");
	}
	function handleDragLeave() {
		setDropEventClassName("");
	}

	function handleMouseEnter() {
		if (!props.draggingTimeline && !props.selectingBeginDate) {
			props.highlightCallbackStore.setHoverTimeline(props.currentTimeline.id);
		}
	}
	// function handleMouseLeave() {
	// 	props.emphasisStore.setHoverTimeline(undefined);
	// }

	return (
		<tr
			id={Timelines.toRowId(props.currentTimeline)}
			className={
				classNames(
					props.currentTimeline.kind,
					"timeline-cell timeline-header",
					"_dynamic_programmable_cell_height",
					dropEventClassName,
					{
						["_dynamic_programmable_groups_level-" + props.level.toString()]: Settings.maybeGroupTimeline(props.currentTimeline),
						"dragging": props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id,
						"selected-previous": props.selectingBeginDate?.previous.has(props.currentTimeline.id),
					}
				)
			}
			onDragEnter={ev => props.draggingTimeline?.onDragEnter(ev, props.currentTimeline)}
			onDragOver={ev => props.draggingTimeline?.onDragOver(ev, props.currentTimeline, handleDragOver)}
			onDragLeave={ev => props.draggingTimeline?.onDragLeave(ev, props.currentTimeline, handleDragLeave)}
			onDrop={ev => props.draggingTimeline?.onDrop(ev, props.currentTimeline)}
			onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
		>
			{props.children}
		</tr>
	);
};

export default TimelineHeaderRow;
