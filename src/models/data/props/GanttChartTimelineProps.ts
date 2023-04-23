import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { EditProps } from "@/models/data/props/EditProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { GroupTimeline, MemberId, AnyTimeline } from "@/models/data/Setting";
import { TimelineStore } from "@/models/store/TimelineStore";


export interface GanttChartTimelineProps extends ConfigurationProps, SettingProps, CalendarInfoProps, TimelineStoreProps {
	parentGroup: GroupTimeline | null;
	currentTimeline: AnyTimeline;
	currentIndex: number;

	chartSize: AreaSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	updateRelations: () => void;
}

