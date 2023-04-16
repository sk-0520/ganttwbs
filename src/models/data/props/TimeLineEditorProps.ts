import { DraggingTimeline } from "../DraggingTimeline";
import { BeginDateCallbacks, SelectingBeginDate } from "../BeginDate";
import { GroupTimeline } from "../Setting";
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
