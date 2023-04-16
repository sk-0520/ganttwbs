import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { GroupTimeline } from "@/models/data/Setting";
import { TimelineStore } from "@/models/store/TimelineStore";

export interface TimeLineEditorProps<TargetTimeline> {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: TargetTimeline;
	timelineStore: TimelineStore;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
}
