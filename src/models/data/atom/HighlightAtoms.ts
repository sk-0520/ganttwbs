import { atom } from "jotai";

import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";

export const ActiveTimelineIdAtom = atom<TimelineId | undefined>(undefined);
export const HoverTimelineIdAtom = atom<TimelineId | undefined>(undefined);
export const HighlightTimelineIdsAtom = atom<Array<TimelineId>>([]);
export const HighlightDaysAtom = atom<Array<DateTime>>([]);
