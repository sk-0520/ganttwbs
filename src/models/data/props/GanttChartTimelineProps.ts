import { AreaSize } from "@/models/data/Area";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, AnyTimeline } from "@/models/data/Setting";


export interface GanttChartTimelineProps extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps, ResourceInfoProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: AnyTimeline;
	currentIndex: number;

	areaSize: AreaSize;
}

