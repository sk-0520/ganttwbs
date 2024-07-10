import type { AreaSize } from "@/models/data/Area";
import type { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import type { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import type { GroupTimeline, AnyTimeline } from "@/models/data/Setting";

export interface GanttChartTimelineProps
	extends ConfigurationProps,
		TimelineCallbacksProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: AnyTimeline;
	currentIndex: number;

	areaSize: AreaSize;
}
