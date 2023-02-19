import { createContext } from 'react';
import { Color } from '../setting/Color';
import * as ISO8601 from '../setting/ISO8601';
import { WeekDay } from '../setting/WeekDay';

interface CalendarSetting {
	range: {
		from: ISO8601.Date;
		to: ISO8601.Date;
	};
	holiday: {
		regulars: { [key in WeekDay]: boolean };
		events: {
			holidays: string;
			specials: string;
		}
	};
}

interface ThemeSetting {
	holiday: {
		regulars: { [key in WeekDay]: Color },
		events: {
			holiday: Color,
			special: Color,
		}
	};
}

export interface SettingContext {
	calendar: CalendarSetting;
	theme: ThemeSetting;
}

export const SettingContext = createContext<SettingContext>({} as SettingContext);
