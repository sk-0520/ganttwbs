import { NextPage } from 'next';
import { useContext, useState } from 'react';
import { SettingContext } from '@/models/data/context/SettingContext';
import { Color } from '@/models/data/setting/Color';
import { WeekDay } from '@/models/data/setting/WeekDay';

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

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
						<tr>
							<td>月曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.monday}
									onChange={ev => handleSetRegularColor('monday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>火曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.tuesday}
									onChange={ev => handleSetRegularColor('tuesday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>水曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.wednesday}
									onChange={ev => handleSetRegularColor('wednesday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>木曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.thursday}
									onChange={ev => handleSetRegularColor('thursday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>金曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.friday}
									onChange={ev => handleSetRegularColor('friday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>土曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.saturday}
									onChange={ev => handleSetRegularColor('saturday', ev.target.value)}
								/>
							</td>
						</tr>
						<tr>
							<td>日曜日</td>
							<td>
								<input type='color'
									defaultValue={holidayRegulars.sunday}
									onChange={ev => handleSetRegularColor('sunday', ev.target.value)}
								/>
							</td>
						</tr>
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
