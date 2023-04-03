import { createContext } from "react";
import { Color, DateOnly, MemberId, WeekDay } from "../Setting";


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
}

export interface GroupSetting {
	key: UUID;
	name: string;
	members: Array<MemberSetting>;
}

export interface CalendarSetting {
	range: {
		from: DateOnly;
		to: DateOnly;
	};
	holiday: {
		regulars: { [key in WeekDay]: boolean };
		events: {
			holidays: string;
			specials: string;
		}
	};
}

export interface ThemeSetting {
	holiday: {
		regulars: { [key in WeekDay]: Color },
		events: {
			holiday: Color,
			special: Color,
		}
	};
	groups: Array<{ key: UUID, value: Color }>;
	timeline: {
		group: Color;
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
