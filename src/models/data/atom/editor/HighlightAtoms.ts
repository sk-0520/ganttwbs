import { atom, useAtomValue, useSetAtom } from "jotai";

import { AtomReader, AtomType, AtomWriter } from "@/models/data/atom/AtomHelper";
import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";

export const ActiveTimelineIdAtom = atom<TimelineId | undefined>(undefined);

export function useActiveTimelineIdAtomReader(): AtomReader<AtomType<typeof ActiveTimelineIdAtom>> {
	return {
		data: useAtomValue(ActiveTimelineIdAtom),
	};
}

export function useActiveTimelineIdAtomWriter(): AtomWriter<AtomType<typeof ActiveTimelineIdAtom>> {
	return {
		write: useSetAtom(ActiveTimelineIdAtom),
	};
}

export const HoverTimelineIdAtom = atom<TimelineId | undefined>(undefined);

export const HighlightTimelineIdsAtom = atom<Array<TimelineId>>([]);

export const HighlightDaysAtom = atom<Array<DateTime>>([]);

export const DragSourceTimelineIdAtom = atom<TimelineId | undefined>(undefined);

export const DragOverTimelineIdAtom = atom<TimelineId | undefined>(undefined);
