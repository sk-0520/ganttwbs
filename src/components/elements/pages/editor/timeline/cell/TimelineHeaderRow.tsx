import classNames from "classnames";
import { FC, ReactNode } from "react";

import { useDraggingTimelineAtomReader } from "@/models/data/atom/editor/DragAndDropAtoms";
import { useHoverTimelineIdAtomWriter } from "@/models/data/atom/editor/HighlightAtoms";
import { SelectingBeginDate } from "@/models/data/BeginDate";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

interface Props extends TimelineStoreProps {
	level: number;
	currentTimeline: AnyTimeline;
	selectingBeginDate: SelectingBeginDate | null;
	children: ReactNode;
}

const TimelineHeaderRow: FC<Props> = (props: Props) => {
	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const draggingTimelineAtomReader = useDraggingTimelineAtomReader();

	function handleMouseEnter() {
		if (!draggingTimelineAtomReader.data && !props.selectingBeginDate) {
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
						"selected-previous": props.selectingBeginDate?.previous.has(props.currentTimeline.id),
						"completed": Settings.maybeTaskTimeline(props.currentTimeline) && 1 <= props.currentTimeline.progress
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
