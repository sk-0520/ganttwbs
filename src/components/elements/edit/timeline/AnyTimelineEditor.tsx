import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { NotifyParentCallbacks } from "@/models/data/NotifyParentCallbacks";
import { RefreshedChildrenCallbacks } from "@/models/data/RefreshedChildrenCallbacks";
import { AnyTimeline, GroupTimeline } from "@/models/data/Setting";
import { TimelineStore } from "@/models/store/TimelineStore";
import { NextPage } from "next";

interface Props {
	treeIndexes: Array<number>;
	parentGroup: GroupTimeline | null;
	currentIndex: number;
	currentTimeline: AnyTimeline;
	timelineStore: TimelineStore;
	draggingTimeline: DraggingTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	notifyParentCallbacks: NotifyParentCallbacks;
	refreshedChildrenCallbacks: RefreshedChildrenCallbacks;
	beginDateCallbacks: BeginDateCallbacks;
}

const Component: NextPage<Props> = (props: Props) => {

}
