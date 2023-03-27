import { DragEvent } from "react";

import { MoveItemKind } from "@/components/elements/edit/timeline/TimelineControls";
import { TimeRange } from "@/models/TimeRange";
import DraggingTimeline from "../DraggingTimeline";
import SelectingBeginDate from "../SelectingBeginDate";
import { GroupTimeline, TaskTimeline, Timeline, TimelineId } from "../Setting";

export default interface TimeLineEditorProps<TargetTimeline> {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: TargetTimeline;
	timeRanges: ReadonlyMap<TimelineId, TimeRange>;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	callbackRefreshChildrenOrder: (kind: MoveItemKind, currentTimeline: Timeline) => void;
	callbackRefreshChildrenBeginDate(): void;
	callbackRefreshChildrenWorkload(): void;
	callbackRefreshChildrenProgress(): void;
	callbackDeleteChildTimeline(currentTimeline: Timeline): void;
	callbackDraggingTimeline(event: DragEvent, timeline: Timeline): void;
	callbackStartSelectBeginDate(timeline: TaskTimeline): void;
	callbackClearSelectBeginDate(timeline: TaskTimeline): void;
	callbackSubmitSelectBeginDate(timeline: TaskTimeline): void;
	callbackCancelSelectBeginDate(timeline: TaskTimeline): void;
}
