import { atom, useAtomValue, useSetAtom } from "jotai";

import { Calendars } from "@/models/Calendars";
import { AtomReader, AtomWriter } from "@/models/data/atom/AtomHelper";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { DayInfo } from "@/models/data/DayInfo";
import { ResourceInfo } from "@/models/data/ResourceInfo";
import { RootTimeline, AnyTimeline, TimelineId, Setting } from "@/models/data/Setting";
import { TimelineItem } from "@/models/data/TimelineItem";
import { WorkRange } from "@/models/data/WorkRange";
import { DateTime, DateTimeTicks } from "@/models/DateTime";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { Require } from "@/models/Require";
import { Resources } from "@/models/Resources";
import { Timelines } from "@/models/Timelines";
import { TimeZone } from "@/models/TimeZone";

/** 設定上。一生同じ。 */
const SettingAtom = atom<Setting>({
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

export function useSettingAtomReader(): AtomReader<Setting> {
	return {
		data: useAtomValue(SettingAtom),
	};
}

export function useSettingAtomWriter(): AtomWriter<Setting> {
	return {
		write: useSetAtom(SettingAtom),
	};
}

/** 設定上のタイムライン。一生同じ。 */
const RootTimelineAtom = atom<RootTimeline>(
	get => {
		const setting = get(SettingAtom);
		return setting.rootTimeline;
	}
);

export function useRootTimelineAtomReader(): AtomReader<RootTimeline> {
	return {
		data: useAtomValue(RootTimelineAtom),
	};
}

const CalendarInfoAtom = atom(
	get => {
		const setting = get(SettingAtom);
		return Calendars.createCalendarInfo(setting.timeZone, setting.calendar);
	}
);

export function useCalendarInfoAtomReader(): AtomReader<CalendarInfo> {
	return {
		data: useAtomValue(CalendarInfoAtom),
	};
}

const ResourceInfoAtom = atom(
	get => {
		const setting = get(SettingAtom);
		return Resources.createResourceInfo(setting.groups);
	}
);

export function useResourceInfoAtomReader(): AtomReader<ResourceInfo> {
	return {
		data: useAtomValue(ResourceInfoAtom),
	};
}

/**
 * 変更基準点。
 *
 * 元々各atom内で依存系を処理してたけど、使い方が悪いのか動かんくてこいつの中で全処理するようにした。
 */
export const SequenceTimelinesWriterAtom = atom<never, Array<AnyTimeline>, void>(
	undefined as never,
	(get, set, ...sequenceTimelines) => {
		if (!sequenceTimelines) {
			throw new Error();
		}

		set(SequenceTimelinesAtom, sequenceTimelines);

		const timelineIndexMap = Timelines.toIndexes(sequenceTimelines);
		set(TimelineIndexMapAtom, timelineIndexMap);

		const timelineMap = Timelines.getTimelinesMap(get(RootTimelineAtom));
		set(TotalTimelineMapAtom, timelineMap);

		const setting = get(SettingAtom);
		const calendarInfo = get(CalendarInfoAtom);
		const totalTimelineMap = get(TotalTimelineMapAtom);

		const workRanges = Timelines.getWorkRanges([...totalTimelineMap.values()], setting.calendar.holiday, setting.recursive, calendarInfo.timeZone);
		set(WorkRangesAtom, workRanges);

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
		set(TimelineItemsAtom, timelineItems);

		const resourceInfoAtom = get(ResourceInfoAtom);
		const dayInfos = Timelines.calcDayInfos(totalTimelineMap, new Set([...workRanges.values()]), resourceInfoAtom);
		set(DayInfosAtom, dayInfos);
	}
);

/** 各タイムラインを上から見たインデックス順の一覧 */
export const SequenceTimelinesAtom = atom<Array<AnyTimeline>>([]);

export type TimelineIndexMap = ReadonlyMap<TimelineId, number>;
/** 各タイムラインを上から見たインデックスのマッピング */
export const TimelineIndexMapAtom = atom<TimelineIndexMap>(new Map());

export type TotalTimelineMapType = ReadonlyMap<TimelineId, AnyTimeline>;
/** 全てのタイムライン(ノード状態ではない) */
export const TotalTimelineMapAtom = atom<TotalTimelineMapType>(new Map());

/** 各工数時間 */
export const WorkRangesAtom = atom<Map<TimelineId, WorkRange>>(new Map());

/** 変更タイムライン */
export const TimelineItemsAtom = atom<Map<TimelineId, TimelineItem>>(new Map());

//ReadonlyMap<TimelineId, TimelineItem>

/** 日に対する何かしらの情報(情報がある時点で死んでる) */
export const DayInfosAtom = atom<Map<DateTimeTicks, DayInfo>>(new Map());
