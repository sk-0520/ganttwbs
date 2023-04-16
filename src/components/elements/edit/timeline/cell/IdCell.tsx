import { SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { NotifyParentCallbacks } from "@/models/data/NotifyParentCallbacks";
import { AnyTimeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { NextPage } from "next";
import IndexNumber from "../IndexNumber";
import { DragEvent } from "react";

interface Props {
	selectingId: string,
	isSelectedPrevious: boolean;
	treeIndexes: ReadonlyArray<number>;
	currentIndex: number;
	readonly currentTimeline: Readonly<AnyTimeline>;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	//notifyParentCallbacks: NotifyParentCallbacks;
	callbackStartDragTimeline(ev:DragEvent): void;
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
						<>
							{
								Settings.maybeGroupTimeline(props.currentTimeline)
									? <span className="timeline-kind icon-timeline-group-after" />
									: <span className="timeline-kind icon-timeline-task-after" />
							}
						</>

					)
				}
				<IndexNumber treeIndexes={props.treeIndexes} currentIndex={props.currentIndex} />
			</label>
		</div>
	)
};

export default Component;
