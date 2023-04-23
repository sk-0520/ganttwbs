import { DeepReadonly } from "ts-essentials";

import { CalendarInfo } from "@/models/data/CalendarInfo";

export interface CalendarInfoProps {
	readonly calendarInfo: DeepReadonly<CalendarInfo> ;
}
