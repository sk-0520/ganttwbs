import { NextPage } from 'next';
import { useContext } from 'react';
import * as Forms from '@/models/Forms';
import { SettingContext } from '@/models/data/context/SettingContext';

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<>
			<p>
				日付 TAB 内容
			</p>
			<div className="holiday">
				<div className="holidays">
					<h3>祝日</h3>
					<textarea
						onKeyDown={Forms.handleKeyDown}
						defaultValue={settingContext.calendar.holiday.events.holidays}
						onChange={ev => settingContext.calendar.holiday.events.holidays = ev.target.value}
					/>
					<div>
						<button>どっかからとってくる系</button>
					</div>
				</div>

				<div className="holidays">
					<h3>特殊</h3>
					<textarea
						onKeyDown={Forms.handleKeyDown}
						defaultValue={settingContext.calendar.holiday.events.specials}
						onChange={ev => settingContext.calendar.holiday.events.specials = ev.target.value}
					/>
				</div>
			</div>
		</>
	);
};

export default Component;
