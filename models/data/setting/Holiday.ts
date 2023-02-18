import { WeekDay } from "./WeekDay";
import * as ISO8601 from "./ISO8601";

export type  HolidayKind =
	'holiday'
	|
	'special'
;

export interface HolidayEvent {
	display: string;
	kind: HolidayKind;
}

/**
 * 休日設定。
 */
export interface Holiday {
	/** 定休曜日 */
	regulars: Array<WeekDay>;
	events: { [key: ISO8601.Date]: HolidayEvent }
}

