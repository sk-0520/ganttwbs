import { AreaSize } from "@/models/data/AreaSize";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, MemberId, AnyTimeline } from "@/models/data/Setting";


export interface GanttChartTimelineProps extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: AnyTimeline;
	currentIndex: number;

	chartSize: AreaSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;
}

