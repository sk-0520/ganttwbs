import classNames from "classnames";
import { DragEvent, FC } from "react";

import { IconImage, IconKind } from "@/components/elements/Icon";
import { useDraggingTimelineAtomReader } from "@/models/data/atom/editor/DragAndDropAtoms";
import { SelectingBeginDate } from "@/models/data/BeginDate";
import { ReadableTimelineId } from "@/models/data/ReadableTimelineId";
import { AnyTimeline, Progress } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

interface Props {
	selectingId: string,
	isSelectedPrevious: boolean;
	readableTimelineId: ReadableTimelineId;
	readonly currentTimeline: Readonly<AnyTimeline>;
	readonly progress: Progress;
	selectingBeginDate: SelectingBeginDate | null;
	callbackStartDragTimeline(ev: DragEvent): void;
	callbackChangePrevious: (isSelected: boolean) => void;
}

const IdCell: FC<Props> = (props: Props) => {

	const className = Timelines.getReadableTimelineIdClassName(props.readableTimelineId);
	const completed = 1 <= props.progress;

	const draggingTimelineAtomReader = useDraggingTimelineAtomReader();

	const canSelect = props.selectingBeginDate && (
		props.selectingBeginDate.timeline.id !== props.currentTimeline.id && props.selectingBeginDate.canSelect(props.currentTimeline)
	);

	return (
		<td
			className={
				classNames(
					"timeline-cell timeline-id",
					{
						dragging: draggingTimelineAtomReader.data?.sourceTimeline.id === props.currentTimeline.id
					}
				)
			}
			title={props.currentTimeline.id}
			draggable={!props.selectingBeginDate}
			onDragStart={ev => props.callbackStartDragTimeline(ev)}
			onDragEnd={draggingTimelineAtomReader.data?.onDragEnd}
		>
			<label>
				{props.selectingBeginDate
					? (
						<>
							<input
								id={props.selectingId}
								className="previous"
								type="checkbox"
								disabled={!canSelect}
								value={props.currentTimeline.id}
								checked={props.isSelectedPrevious}
								onChange={ev => props.callbackChangePrevious(ev.target.checked)}
							/>
							<IconImage
								kind={props.isSelectedPrevious ? IconKind.CheckBoxTimelinePreviousOn : IconKind.CheckBoxTimelinePreviousOff}
								fill={canSelect ? undefined : "gray"}
							/>
						</>
					) :
					(
						Settings.maybeGroupTimeline(props.currentTimeline)
							? <IconImage kind={IconKind.TimelineGroup} fill={completed ? "#555": undefined} />
							: <IconImage kind={IconKind.TimelineTask} fill={completed ? "#555": undefined} />
					)
				}
				<span className={className}>
					{Timelines.toReadableTimelineId(props.readableTimelineId)}
				</span>
			</label>
		</td>
	);
};

export default IdCell;
