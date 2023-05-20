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

export const DragSourceTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DraggingTimelineAtom = atom<DraggingTimeline | undefined>(undefined);
