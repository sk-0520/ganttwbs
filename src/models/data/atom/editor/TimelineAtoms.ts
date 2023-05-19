import { atom } from "jotai";

import { Calendars } from "@/models/Calendars";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { RootTimeline, AnyTimeline, TimelineId, Setting } from "@/models/data/Setting";
import { TimelineItem } from "@/models/data/TimelineItem";
import { DateTime } from "@/models/DateTime";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { Require } from "@/models/Require";
import { Resources } from "@/models/Resources";
import { Timelines } from "@/models/Timelines";
import { TimeZone } from "@/models/TimeZone";

export const DetailEditTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DragSourceTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DraggingTimelineAtom = atom<DraggingTimeline | undefined>(undefined);

/** 設定上。一生同じ。 */
export const SettingAtom = atom<Setting>({
	name: "",
	recursive: DefaultSettings.RecursiveMaxCount,
	version: DefaultSettings.SettingVersion,
	timeZone: TimeZone.utc.serialize(),
	calendar: {
		holiday: {
			regulars: [],
			events: {},
		},
		range: {
			begin: Timelines.serializeDateTime(DateTime.today(TimeZone.utc)),
			end: Timelines.serializeDateTime(DateTime.today(TimeZone.utc)),
		},
	},
	theme: {
		groups: [],
		holiday: {
			regulars: {},
			events: {},
		},
		timeline: {
			defaultGroup: "",
			defaultTask: "",
			completed: "",
		},
	},
	groups: [],
	rootTimeline: {
		id: IdFactory.rootTimelineId,
		kind: "group",
		subject: "",
		comment: "",
		children: []
	},
	versions: [],
} satisfies Setting);

/** 設定上のタイムライン。一生同じ。 */
export const RootTimelineAtom = atom<RootTimeline>(
	get => {
		const setting = get(SettingAtom);
		return setting.rootTimeline;
	}
);

export const CalendarInfoAtom = atom(
	get => {
		const setting = get(SettingAtom);
		return Calendars.createCalendarInfo(setting.timeZone, setting.calendar);
	}
);

export const ResourceInfoAtom = atom(
	get => {
		const setting = get(SettingAtom);
		return Resources.createResourceInfo(setting.groups);
	}
);

/** 各タイムラインを上から見たインデックス順の一覧 */
export const SequenceTimelinesAtom = atom<Array<AnyTimeline>>([]);

export type TimelineIndexMap = ReadonlyMap<TimelineId, number>;
/** 各タイムラインを上から見たインデックスのマッピング */
export const TimelineIndexMapAtom = atom<TimelineIndexMap>(
	get => {
		const sequenceTimelines = get(SequenceTimelinesAtom);
		return Timelines.toIndexes(sequenceTimelines);
	}
);

export type TotalTimelineMapType = ReadonlyMap<TimelineId, AnyTimeline>;
/** 全てのタイムライン(ノード状態ではない) */
export const TotalTimelineMapAtom = atom<TotalTimelineMapType>(new Map());

export const WorkRangesAtom = atom(
	get => {
		const setting = get(SettingAtom);
		const calendarInfo = get(CalendarInfoAtom);
		const totalTimelineMap = get(TotalTimelineMapAtom);

		const workRanges = Timelines.getWorkRanges([...totalTimelineMap.values()], setting.calendar.holiday, setting.recursive, calendarInfo.timeZone);
		return workRanges;
	}
);

export const TimelineItemsAtom = atom(
	get => {
		const timelineMap = get(TotalTimelineMapAtom);
		const workRanges = get(WorkRangesAtom);

		const timelineItems = new Map(
			[...timelineMap.entries()]
				.map(([k, v]) => {
					const item: TimelineItem = {
						timeline: v,
						workRange: Require.get(workRanges, k),
					};

					return [k, item];
				})
		);

		return timelineItems;
	}
);
//ReadonlyMap<TimelineId, TimelineItem>
