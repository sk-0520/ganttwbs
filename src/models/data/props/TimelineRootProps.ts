import { GroupTimeline, TaskTimeline } from "../Setting";

export interface TimelineRootProps {
	timelineRootNodes: Array<GroupTimeline | TaskTimeline>;
	setTimelineRootNodes: (timelineRootNodes: Array<GroupTimeline | TaskTimeline>) => void;
}
