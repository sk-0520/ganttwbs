import { atom } from "jotai";

import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { AnyTimeline } from "@/models/data/Setting";

export const DetailEditTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DragSourceTimelineAtom = atom<AnyTimeline | undefined>(undefined);
export const DraggingTimelineAtom = atom<DraggingTimeline | undefined>(undefined);
