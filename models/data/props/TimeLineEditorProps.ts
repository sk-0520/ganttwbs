import { DragEvent } from "react";

import { MoveItemKind } from "@/components/elements/edit/timeline/TimelineControls";
import { TimeRange } from "@/models/TimeRange";
import DraggingTimeline from "../DraggingTimeline";
import {BeginDateCallbacks, SelectingBeginDate} from "../BeginDate";
import { GroupTimeline, TaskTimeline, Timeline, TimelineId } from "../Setting";
import RefreshedChildrenCallbacks from "../RefreshedChildrenCallbacks";
import NotifyParentCallbacks from "../NotifyParentCallbacks";

export default interface TimeLineEditorProps<TargetTimeline> {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: TargetTimeline;
	timeRanges: ReadonlyMap<TimelineId, TimeRange>;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	notifyParentCallbacks: NotifyParentCallbacks;
	refreshedChildrenCallbacks: RefreshedChildrenCallbacks;
	beginDateCallbacks: BeginDateCallbacks;
}
