import classNames from "classnames";
import { NextPage } from "next";
import { DragEvent } from "react";

import Icon, { IconKind } from "@/components/elements/Icon";
import { SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { AnyTimeline } from "@/models/data/Setting";
import { TimelineIndex } from "@/models/data/TimelineIndex";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

interface Props {
	selectingId: string,
	isSelectedPrevious: boolean;
	timelineIndex: TimelineIndex;
	readonly currentTimeline: Readonly<AnyTimeline>;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	callbackStartDragTimeline(ev: DragEvent): void;
	callbackChangePrevious: (isSelected: boolean) => void;
}

const IdCell: NextPage<Props> = (props: Props) => {
	const className = "_dynamic_programmable_indexNumber_level-" + props.timelineIndex.level;

	const canSelect = props.selectingBeginDate && (
		props.selectingBeginDate.timeline.id !== props.currentTimeline.id && props.selectingBeginDate.canSelect(props.currentTimeline)
	);

	return (
		<td
			className={
				classNames(
					"timeline-cell timeline-id",
					{
						dragging: props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id
					}
				)
			}
			title={props.currentTimeline.id}
			draggable={!props.selectingBeginDate}
			onDragStart={ev => props.callbackStartDragTimeline(ev)}
			onDragEnd={props.draggingTimeline?.onDragEnd}
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
							<Icon
								kind={props.isSelectedPrevious ? IconKind.CheckBoxTimelinePreviousOn : IconKind.CheckBoxTimelinePreviousOff}
								fill={canSelect ? undefined : "gray"}
							/>
						</>
					) :
					(
						Settings.maybeGroupTimeline(props.currentTimeline)
							? <Icon kind={IconKind.TimelineGroup} />
							: <Icon kind={IconKind.TimelineTask} />
					)
				}
				<span className={className}>
					{Timelines.toIndexNumber(props.timelineIndex)}
				</span>
			</label>
		</td>
	);
};

export default IdCell;
