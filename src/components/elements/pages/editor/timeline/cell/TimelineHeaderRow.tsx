import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, ReactNode } from "react";

import { HoverTimelineIdAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { DraggingTimelineAtom } from "@/models/data/atom/editor/TimelineAtoms";
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
	const setHoverTimelineId = useSetAtom(HoverTimelineIdAtom);
	const draggingTimeline = useAtomValue(DraggingTimelineAtom);

	function handleMouseEnter() {
		if (!draggingTimeline && !props.selectingBeginDate) {
			setHoverTimelineId(props.currentTimeline.id);
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
						"dragging": draggingTimeline?.sourceTimeline.id === props.currentTimeline.id,
						"selected-previous": props.selectingBeginDate?.previous.has(props.currentTimeline.id),
					}
				)
			}
			onDragEnter={ev => draggingTimeline?.onDragEnter(ev, props.currentTimeline)}
			onDragOver={ev => draggingTimeline?.onDragOver(ev, props.currentTimeline)}
			onDragLeave={ev => draggingTimeline?.onDragLeave(ev, props.currentTimeline)}
			onDrop={ev => draggingTimeline?.onDrop(ev, props.currentTimeline)}
			onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
		>
			{props.children}
		</tr>
	);
};

export default TimelineHeaderRow;
