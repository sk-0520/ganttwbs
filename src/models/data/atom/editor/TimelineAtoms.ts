import { atom } from "jotai";

import { AnyTimeline } from "@/models/data/Setting";

export const DetailEditTimelineAtom = atom<AnyTimeline | undefined>(undefined);
