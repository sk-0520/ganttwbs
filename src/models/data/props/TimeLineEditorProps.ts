import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { GroupTimeline } from "@/models/data/Setting";
import { TimelineCallbacks } from "@/models/data/TimelineCallbacks";

export interface TimeLineEditorProps<TargetTimeline> {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: TargetTimeline;
	timelineStore: TimelineCallbacks;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
}
