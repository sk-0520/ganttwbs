import { atom } from "jotai";

import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";

export const DetailEditTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DragSourceTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DraggingTimelineAtom = atom<DraggingTimeline | undefined>(undefined);

export const SequenceTimelinesAtom = atom<Array<AnyTimeline>>([]);
export type TimelineIndexMap = ReadonlyMap<TimelineId, number>;
export const TimelineIndexMapAtom = atom<TimelineIndexMap>(
	get => {
		const sequenceTimelines = get(SequenceTimelinesAtom);
		return Timelines.toIndexes(sequenceTimelines);
	}
);
