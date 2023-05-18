import { atom } from "jotai";

import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { RootTimeline, AnyTimeline, TimelineId } from "@/models/data/Setting";
import { IdFactory } from "@/models/IdFactory";
import { Timelines } from "@/models/Timelines";

export const DetailEditTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DragSourceTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DraggingTimelineAtom = atom<DraggingTimeline | undefined>(undefined);

/** 設定上のタイムライン。一生同じ。 */
export const RootTimelineAtom = atom<RootTimeline>({
	id: IdFactory.rootTimelineId,
	kind: "group",
	subject: "",
	comment: "",
	children: [],
} satisfies RootTimeline);

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
