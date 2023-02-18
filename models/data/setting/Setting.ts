import Calendar from "./Calendar";
import { Theme } from "./Theme";

export interface Setting {
	name: string;
	calendar: Calendar;
	theme: Theme;
}
