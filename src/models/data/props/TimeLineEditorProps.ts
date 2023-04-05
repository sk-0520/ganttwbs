import { DraggingTimeline } from "../DraggingTimeline";
import { BeginDateCallbacks, SelectingBeginDate } from "../BeginDate";
import { GroupTimeline, TimelineId } from "../Setting";
import { RefreshedChildrenCallbacks } from "../RefreshedChildrenCallbacks";
import { NotifyParentCallbacks } from "../NotifyParentCallbacks";
import { DateTimeRange } from "../DateTimeRange";
import { TimelineStore } from "@/models/store/TimelineStore";

export interface TimeLineEditorProps<TargetTimeline> {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: TargetTimeline;
	timeRanges: ReadonlyMap<TimelineId, DateTimeRange>;
	timelineStore: TimelineStore;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	notifyParentCallbacks: NotifyParentCallbacks;
	refreshedChildrenCallbacks: RefreshedChildrenCallbacks;
	beginDateCallbacks: BeginDateCallbacks;
}
