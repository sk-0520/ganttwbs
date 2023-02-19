import { createContext } from 'react';
import { EditData } from '../EditData';
import { Setting } from '../setting/Setting';
import * as ISO8601 from '../setting/ISO8601';
import { Holiday } from '../setting/Holiday';



interface CalendarSetting {
	range: {
		from: ISO8601.Date;
		to: ISO8601.Date;
	};
	holiday: {
		week: {
			sunday: boolean;
			monday: boolean;
			tuesday: boolean;
			wednesday: boolean;
			thursday: boolean;
			friday: boolean;
			saturday: boolean;
		};
		holidays: string;
		specials: string;
	};
}

export interface SettingContext {
	calendar: CalendarSetting;
}

export const SettingContext = createContext<SettingContext>({} as SettingContext);
