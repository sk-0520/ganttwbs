import { atom, useAtomValue, useSetAtom } from "jotai";

import { AtomReader, AtomType, AtomWriter } from "@/models/data/atom/AtomHelper";
import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";

const ActiveTimelineIdAtom = atom<TimelineId | undefined>(undefined);

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


const HoverTimelineIdAtom = atom<TimelineId | undefined>(undefined);

export function useHoverTimelineIdAtomReader(): AtomReader<AtomType<typeof HoverTimelineIdAtom>> {
	return {
		data: useAtomValue(HoverTimelineIdAtom),
	};
}

export function useHoverTimelineIdAtomWriter(): AtomWriter<AtomType<typeof HoverTimelineIdAtom>> {
	return {
		write: useSetAtom(HoverTimelineIdAtom),
	};
}

const HighlightTimelineIdsAtom = atom<Array<TimelineId>>([]);

export function useHighlightTimelineIdsAtomReader(): AtomReader<AtomType<typeof HighlightTimelineIdsAtom>> {
	return {
		data: useAtomValue(HighlightTimelineIdsAtom),
	};
}

export function useHighlightTimelineIdsAtomWriter(): AtomWriter<AtomType<typeof HighlightTimelineIdsAtom>> {
	return {
		write: useSetAtom(HighlightTimelineIdsAtom),
	};
}


const HighlightDaysAtom = atom<Array<DateTime>>([]);

export function useHighlightDaysAtomReader(): AtomReader<AtomType<typeof HighlightDaysAtom>> {
	return {
		data: useAtomValue(HighlightDaysAtom),
	};
}

export function useHighlightDaysAtomWriter(): AtomWriter<AtomType<typeof HighlightDaysAtom>> {
	return {
		write: useSetAtom(HighlightDaysAtom),
	};
}


const DragSourceTimelineIdAtom = atom<TimelineId | undefined>(undefined);

export function useDragSourceTimelineIdAtomReader(): AtomReader<AtomType<typeof DragSourceTimelineIdAtom>> {
	return {
		data: useAtomValue(DragSourceTimelineIdAtom),
	};
}

export function useDragSourceTimelineIdAtomWriter(): AtomWriter<AtomType<typeof DragSourceTimelineIdAtom>> {
	return {
		write: useSetAtom(DragSourceTimelineIdAtom),
	};
}

const DragOverTimelineIdAtom = atom<TimelineId | undefined>(undefined);

export function useDragOverTimelineIdAtomReader(): AtomReader<AtomType<typeof DragOverTimelineIdAtom>> {
	return {
		data: useAtomValue(DragOverTimelineIdAtom),
	};
}

export function useDragOverTimelineIdAtomWriter(): AtomWriter<AtomType<typeof DragOverTimelineIdAtom>> {
	return {
		write: useSetAtom(DragOverTimelineIdAtom),
	};
}
