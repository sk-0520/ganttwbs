import classNames from "classnames";
import { FC, ReactNode } from "react";

import { useSelectingBeginDateAtomReader } from "@/models/atom/editor/BeginDateAtoms";
import { useDraggingTimelineAtomReader } from "@/models/atom/editor/DragAndDropAtoms";
import { useHoverTimelineIdAtomWriter } from "@/models/atom/editor/HighlightAtoms";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

interface Props extends TimelineCallbacksProps {
	level: number;
	currentTimeline: AnyTimeline;
	isCompletedTask: boolean;
	children: ReactNode;
}

const TimelineHeaderRow: FC<Props> = (props: Props) => {
	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const draggingTimelineAtomReader = useDraggingTimelineAtomReader();
	const selectingBeginDateAtomReader = useSelectingBeginDateAtomReader();

	function handleMouseEnter() {
		if (!draggingTimelineAtomReader.data && !selectingBeginDateAtomReader.data) {
			hoverTimelineIdAtomWriter.write(props.currentTimeline.id);
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
					{
						["_dynamic_programmable_groups_level-" + props.level.toString()]: Settings.maybeGroupTimeline(props.currentTimeline),
						"dragging": draggingTimelineAtomReader.data?.sourceTimeline.id === props.currentTimeline.id,
						"selected-previous": selectingBeginDateAtomReader.data?.previous.has(props.currentTimeline.id),
						"completed": props.isCompletedTask
					}
				)
			}
			onDragEnter={ev => draggingTimelineAtomReader.data?.onDragEnter(ev, props.currentTimeline)}
			onDragOver={ev => draggingTimelineAtomReader.data?.onDragOver(ev, props.currentTimeline)}
			onDragLeave={ev => draggingTimelineAtomReader.data?.onDragLeave(ev, props.currentTimeline)}
			onDrop={ev => draggingTimelineAtomReader.data?.onDrop(ev, props.currentTimeline)}
			onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
		>
			{props.children}
		</tr>
	);
};

export default TimelineHeaderRow;
