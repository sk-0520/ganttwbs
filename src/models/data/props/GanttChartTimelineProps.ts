import { AreaSize } from "@/models/data/Area";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, AnyTimeline } from "@/models/data/Setting";


export interface GanttChartTimelineProps extends ConfigurationProps, TimelineCallbacksProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: AnyTimeline;
	currentIndex: number;

	areaSize: AreaSize;
}

