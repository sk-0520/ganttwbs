import { NextPage } from 'next';
import { useContext } from 'react';
import { SettingContext } from '@/models/data/context/SettingContext';

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<>
			<ul>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.monday}
							onChange={ev => settingContext.calendar.holiday.regulars.monday = ev.target.checked}
						/>
						月曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.tuesday}
							onChange={ev => settingContext.calendar.holiday.regulars.tuesday = ev.target.checked}
						/>
						火曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.wednesday}
							onChange={ev => settingContext.calendar.holiday.regulars.wednesday = ev.target.checked}
						/>
						水曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.thursday}
							onChange={ev => settingContext.calendar.holiday.regulars.thursday = ev.target.checked}
						/>
						木曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.friday}
							onChange={ev => settingContext.calendar.holiday.regulars.friday = ev.target.checked}
						/>
						金曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.saturday}
							onChange={ev => settingContext.calendar.holiday.regulars.saturday = ev.target.checked}
						/>
						土曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.regulars.sunday}
							onChange={ev => settingContext.calendar.holiday.regulars.sunday = ev.target.checked}
						/>
						日曜日
					</label>
				</li>
			</ul>
		</>
	);
};

export default Component;
