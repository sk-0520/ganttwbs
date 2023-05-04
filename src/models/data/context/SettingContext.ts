import { createContext } from "react";

import { Color, DateOnly, MemberId, WeekDay } from "@/models/data/Setting";
import { TimeZone } from "@/models/TimeZone";


export type UUID = string;

export interface MemberSetting {
	key: UUID;
	id: MemberId;
	name: string;
	color: Color;
	priceCost: number;
	priceSales: number;
}

export interface GeneralSetting {
	name: string;
	recursive: number;
	version: number;
	timeZone: TimeZone;
}

export interface GroupSetting {
	key: UUID;
	name: string;
	members: Array<MemberSetting>;
}

export interface CalendarSetting {
	range: {
		begin: DateOnly;
		end: DateOnly;
	};
	holiday: {
		regulars: { [key in WeekDay]: boolean };
		events: {
			normal: string;
			special: string;
		}
	};
}

export interface ThemeSetting {
	holiday: {
		regulars: { [key in WeekDay]: Color },
		events: {
			normal: Color,
			special: Color,
		}
	};
	groups: Array<{ key: UUID, value: Color }>;
	timeline: {
		defaultGroup: Color;
		defaultTask: Color;
		completed: Color;
	};
}

export interface SettingContext {
	general: GeneralSetting;
	groups: Array<GroupSetting>,
	calendar: CalendarSetting;
	theme: ThemeSetting;
}

export const SettingContext = createContext<SettingContext>({} as SettingContext);
