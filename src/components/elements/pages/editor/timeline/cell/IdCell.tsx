import { NextPage } from "next";
import { DragEvent } from "react";

import Icon from "@/components/elements/Icon";
import IndexNumber from "@/components/elements/pages/editor/timeline/IndexNumber";
import { SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { AnyTimeline } from "@/models/data/Setting";
import { IconKind } from "@/models/IconKind";
import { Settings } from "@/models/Settings";

interface Props {
	selectingId: string,
	isSelectedPrevious: boolean;
	treeIndexes: ReadonlyArray<number>;
	currentIndex: number;
	readonly currentTimeline: Readonly<AnyTimeline>;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	callbackStartDragTimeline(ev: DragEvent): void;
	callbackChangePrevious: (isSelected: boolean) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div
			className={
				"timeline-cell timeline-id"
				+ (props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id ? " dragging" : "")
			}
			title={props.currentTimeline.id}
			draggable={!props.selectingBeginDate}
			onDragStart={ev => props.callbackStartDragTimeline(ev)}
			onDragEnd={props.draggingTimeline?.onDragEnd}
		>
			<label>
				{props.selectingBeginDate
					? (
						<input
							id={props.selectingId}
							type="checkbox"
							disabled={
								(Settings.maybeGroupTimeline(props.currentTimeline) && !props.selectingBeginDate.canSelect(props.currentTimeline))
								||
								props.selectingBeginDate.timeline.id === props.currentTimeline.id || !props.selectingBeginDate.canSelect(props.currentTimeline)
							}
							value={props.currentTimeline.id}
							checked={props.isSelectedPrevious}
							onChange={ev => props.callbackChangePrevious(ev.target.checked)}
						/>
					) :
					(
						Settings.maybeGroupTimeline(props.currentTimeline)
							? <Icon kind={IconKind.TimelineGroup} fill="yellow" />
							: <Icon kind={IconKind.TimelineTask} fill="green" />
					)
				}
				<IndexNumber treeIndexes={props.treeIndexes} currentIndex={props.currentIndex} />
			</label>
		</div>
	);
};

export default Component;
