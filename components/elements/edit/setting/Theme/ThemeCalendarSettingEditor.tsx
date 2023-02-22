import { NextPage } from 'next';
import { useContext, useState } from 'react';
import { SettingContext } from '@/models/data/context/SettingContext';
import { Color } from '@/models/data/setting/Color';
import { getWeekDays, WeekDay } from '@/models/data/setting/WeekDay';
import { useLocale } from '@/models/locales/locale';

const Component: NextPage = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const weekDays = getWeekDays();

	const [holidayRegulars, setHolidayRegulars] = useState(settingContext.theme.holiday.regulars);
	const [holidayEvents, setHolidayEvents] = useState(settingContext.theme.holiday.events);

	function handleSetRegularColor(week: WeekDay, color: Color) {
		holidayRegulars[week] = color;
		setHolidayRegulars(holidayRegulars);
	}

	function handleSetHolidayEventColor(event: 'holiday' | 'special', color: Color) {
		holidayEvents[event] = color;
		setHolidayEvents(holidayEvents);
	}
	return (
		<dl className='inputs'>
			<dt>曜日</dt>
			<dd>
				<table>
					<tbody>
						{weekDays.map(a => (
							<tr key={a}>
								<td>{locale.calendar.week.long[a]}</td>
								<td>
									<input type='color'
										defaultValue={holidayRegulars[a]}
										onChange={ev => handleSetRegularColor(a, ev.target.value)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</dd>

			<dt>祝日</dt>
			<dd>
				<table>
					<tbody>
						<tr>
							<td>祝日</td>
							<td>
								<input type='color'
									defaultValue={holidayEvents.holiday}
									onChange={ev => handleSetHolidayEventColor('holiday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>特殊</td>
							<td>
								<input type='color'
									defaultValue={holidayEvents.special}
									onChange={ev => handleSetHolidayEventColor('special', ev.target.value)}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</dd>
		</dl>
	);
};

export default Component;
