import { NextPage } from 'next';
import { useContext } from 'react';
import { SettingContext } from '@/models/data/context/SettingContext';
import { useLocale } from '@/models/locales/locale';
import { getWeekDays } from '@/models/data/setting/WeekDay';

const Component: NextPage = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const weekDays = getWeekDays();

	return (
		<ul>
			{weekDays.map(a => (
				<li key={a}>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars[a]}
							onChange={ev => settingContext.calendar.holiday.regulars[a] = ev.target.checked}
						/>
						{locale.calendar.week.long[a]}
					</label>
				</li>
			))}
		</ul>
	);
};

export default Component;
