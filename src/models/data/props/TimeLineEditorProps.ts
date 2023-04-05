import { DraggingTimeline } from "../DraggingTimeline";
import { BeginDateCallbacks, SelectingBeginDate } from "../BeginDate";
import { GroupTimeline, TimelineId } from "../Setting";
import { RefreshedChildrenCallbacks } from "../RefreshedChildrenCallbacks";
import { NotifyParentCallbacks } from "../NotifyParentCallbacks";
import { DateTimeRange } from "../DateTimeRange";

export interface TimeLineEditorProps<TargetTimeline> {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: TargetTimeline;
	timeRanges: ReadonlyMap<TimelineId, DateTimeRange>;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	notifyParentCallbacks: NotifyParentCallbacks;
	refreshedChildrenCallbacks: RefreshedChildrenCallbacks;
	beginDateCallbacks: BeginDateCallbacks;
}
