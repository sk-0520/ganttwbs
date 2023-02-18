import { DateRange } from '@/models/data/setting/DateRange';
import { Holiday } from '@/models/data/setting/Holiday';

export default interface SettingCalendar {
	range: DateRange;
	holiday: Holiday;
}
