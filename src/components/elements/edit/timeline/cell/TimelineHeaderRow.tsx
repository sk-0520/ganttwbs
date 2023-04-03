import { SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";

interface Props {
	level: number;
	currentTimeline: Timeline;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	children: ReactNode;
}

const Component: NextPage<Props> = (props: Props) => {

	const [dropEventClassName, setDropEventClassName] = useState("");
	const [mouseEnterClassName, setMouseEnterClassName] = useState("");

	useEffect(() => {
		if (!props.draggingTimeline) {
			setDropEventClassName("");
		}
	}, [props.draggingTimeline]);

	function handleDragOver() {
		setDropEventClassName("drag-over")
	}
	function handleDragLeave() {
		setDropEventClassName("")
	}

	function handleMouseEnter() {
		if (!props.draggingTimeline && !props.selectingBeginDate) {
			setMouseEnterClassName("hover");
		}
	}
	function handleMouseLeave() {
		setMouseEnterClassName("");
	}

	return (
		<div
			className={
				"timeline-cell timeline-header"
				+ " _dynamic_programmable_cell_height"
				+ (Settings.maybeGroupTimeline(props.currentTimeline) ? " _dynamic_programmable_groups_level-" + props.level.toString(): "")
				+ " " + mouseEnterClassName
				+ (Settings.maybeTaskTimeline(props.currentTimeline) ? props.selectingBeginDate?.timeline.id === props.currentTimeline.id ? " " + "hover" : "" : "")
				+ (props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id ? " dragging" : "")
				+ " " + dropEventClassName
			}
			onDragEnter={ev => props.draggingTimeline?.onDragEnter(ev, props.currentTimeline)}
			onDragOver={ev => props.draggingTimeline?.onDragOver(ev, props.currentTimeline, handleDragOver)}
			onDragLeave={ev => props.draggingTimeline?.onDragLeave(ev, props.currentTimeline, handleDragLeave)}
			onDrop={ev => props.draggingTimeline?.onDrop(ev, props.currentTimeline)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{props.children}
		</div>
	);
};

export default Component;
