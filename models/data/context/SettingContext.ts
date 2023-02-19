import { createContext } from 'react';
import { EditData } from '../EditData';
import { Setting } from '../setting/Setting';

export interface SettingContext extends Setting {
}

export const SettingContext = createContext<SettingContext>({} as SettingContext);
