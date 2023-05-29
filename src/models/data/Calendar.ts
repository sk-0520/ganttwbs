import { HolidayEventMapValue } from "@/models/data/HolidayEventMapValue";
import { DateTimeTicks, WeekIndex } from "@/models/DateTime";

/** 該当祝日の基準タイムゾーン00:00:00のUNIX時間がキーとなる */
export type HolidayEventMap = ReadonlyMap<DateTimeTicks, Readonly<HolidayEventMapValue>>;
export type HolidayRegulars = ReadonlySet<WeekIndex>;
