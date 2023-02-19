import { NextPage } from "next";
import { useContext } from "react";
//import { useForm } from "react-hook-form";
import { SettingContext } from "@/models/data/context/SettingContext";
import { WeekDay } from "@/models/data/setting/WeekDay";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<>
			<ul>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.sunday}
							onChange={ev => settingContext.calendar.holiday.week.sunday = ev.target.checked}
						/>
						日曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.monday}
							onChange={ev => settingContext.calendar.holiday.week.monday = ev.target.checked}
						/>
						月曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.tuesday}
							onChange={ev => settingContext.calendar.holiday.week.tuesday = ev.target.checked}
						/>
						火曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.wednesday}
							onChange={ev => settingContext.calendar.holiday.week.wednesday = ev.target.checked}
						/>
						水曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.thursday}
							onChange={ev => settingContext.calendar.holiday.week.thursday = ev.target.checked}
						/>
						木曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.friday}
							onChange={ev => settingContext.calendar.holiday.week.friday = ev.target.checked}
						/>
						金曜日
					</label>
				</li>
				<li>
					<label>
						<input
							type='checkbox'
							defaultChecked={settingContext.calendar.holiday.week.saturday}
							onChange={ev => settingContext.calendar.holiday.week.saturday = ev.target.checked}
						/>
						土曜日
					</label>
				</li>
			</ul>
		</>
	);
};

export default Component;
