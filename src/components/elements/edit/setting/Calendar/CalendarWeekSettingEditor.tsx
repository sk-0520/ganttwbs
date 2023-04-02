import { NextPage } from "next";
import { useContext } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import { useLocale } from "@/locales/locale";
import { Settings } from "@/models/Settings";

const Component: NextPage = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const weekDays = Settings.getWeekDays();

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
