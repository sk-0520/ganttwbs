import classNames from "classnames";
import { FC, ReactNode, useEffect, useState } from "react";

import { SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { AnyTimeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";

interface Props {
	level: number;
	currentTimeline: AnyTimeline;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	timelineStore: TimelineStore;
	children: ReactNode;
}

const TimelineHeaderRow: FC<Props> = (props: Props) => {

	const [dropEventClassName, setDropEventClassName] = useState("");
	const [mouseEnterClassName/*, setMouseEnterClassName*/] = useState("");

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
			//setMouseEnterClassName("hover");
			props.timelineStore.setHoverTimeline(props.currentTimeline);
		}
	}
	// function handleMouseLeave() {
	// 	props.timelineStore.setHoverTimeline(null);
	// 	//setMouseEnterClassName("");
	// }

	return (
		<tr
			id={Timelines.toRowId(props.currentTimeline)}
			className={
				classNames(
					props.currentTimeline.kind,
					"timeline-cell timeline-header",
					"_dynamic_programmable_cell_height",
					mouseEnterClassName,
					dropEventClassName,
					{
						["_dynamic_programmable_groups_level-" + props.level.toString()]: Settings.maybeGroupTimeline(props.currentTimeline),
						"hover": Settings.maybeTaskTimeline(props.currentTimeline) && props.selectingBeginDate?.timeline.id === props.currentTimeline.id,
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
		>
			{props.children}
		</tr>
	);
};

export default TimelineHeaderRow;
