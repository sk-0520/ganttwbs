import { atom, useAtomValue, useSetAtom } from "jotai";

import { AtomReader, AtomType, AtomWriter } from "@/models/data/atom/AtomHelper";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { AnyTimeline } from "@/models/data/Setting";

const DetailEditTimelineAtom = atom<AnyTimeline | undefined>(undefined);

export function useDetailEditTimelineAtomReader(): AtomReader<AtomType<typeof DetailEditTimelineAtom>> {
	return {
		data: useAtomValue(DetailEditTimelineAtom),
	};
}

export function useDetailEditTimelineAtomWriter(): AtomWriter<AtomType<typeof DetailEditTimelineAtom>> {
	return {
		write: useSetAtom(DetailEditTimelineAtom),
	};
}


const DragSourceTimelineAtom = atom<AnyTimeline | undefined>(undefined);

export function useDragSourceTimelineAtomReader(): AtomReader<AtomType<typeof DragSourceTimelineAtom>> {
	return {
		data: useAtomValue(DragSourceTimelineAtom),
	};
}

export function useDragSourceTimelineAtomWriter(): AtomWriter<AtomType<typeof DragSourceTimelineAtom>> {
	return {
		write: useSetAtom(DragSourceTimelineAtom),
	};
}


const DraggingTimelineAtom = atom<DraggingTimeline | undefined>(undefined);

export function useDraggingTimelineAtomReader(): AtomReader<AtomType<typeof DraggingTimelineAtom>> {
	return {
		data: useAtomValue(DraggingTimelineAtom),
	};
}

export function useDraggingTimelineAtomWriter(): AtomWriter<AtomType<typeof DraggingTimelineAtom>> {
	return {
		write: useSetAtom(DraggingTimelineAtom),
	};
}
