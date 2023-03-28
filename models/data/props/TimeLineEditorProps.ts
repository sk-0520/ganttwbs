import { TimeRange } from "@/models/TimeRange";
import { DraggingTimeline } from "../DraggingTimeline";
import { BeginDateCallbacks, SelectingBeginDate } from "../BeginDate";
import { GroupTimeline, TimelineId } from "../Setting";
import { RefreshedChildrenCallbacks } from "../RefreshedChildrenCallbacks";
import { NotifyParentCallbacks } from "../NotifyParentCallbacks";

export interface TimeLineEditorProps<TargetTimeline> {
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
