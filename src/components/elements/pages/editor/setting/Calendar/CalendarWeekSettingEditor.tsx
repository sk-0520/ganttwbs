import { FC, useContext, useState } from "react";

import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/data/context/SettingContext";
import { WeekDay } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { Settings } from "@/models/Settings";

const CalendarWeekSettingEditor: FC = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const [weeks, setWeeks] = useState(settingContext.calendar.holiday.regulars);

	function handleChange(weekDay: WeekDay, checked: boolean): void {
		setWeeks(
			settingContext.calendar.holiday.regulars = {
				...weeks,
				[weekDay]: checked,
			}
		);
	}

	function handleReset() {
		const weekDays = Settings.getWeekDays()
			.map(a => ({[a]: false}))
			.reduce((r, a) => ({ ...r, ...a }))
		;
		const defaultRegulars = Object.keys(DefaultSettings.getRegularHolidays())
			.map(a => ({[a]: true}))
			.reduce((r, a) => ({ ...r, ...a }))
		;

		const defaultWeeks = {
			...weekDays,
			...defaultRegulars,
		} as { [key in WeekDay]: boolean };

		setWeeks(
			settingContext.calendar.holiday.regulars = defaultWeeks
		);
	}

	const weekDays = Settings.getWeekDays();

	return (
		<ul>
			{weekDays.map(a => (
				<li key={a}>
					<label>
						<input
							type="checkbox"
							checked={weeks[a]}
							onChange={ev => handleChange(a, ev.target.checked)}
						/>
						{locale.common.calendar.week.long[a]}
					</label>
				</li>
			))}
			<li>
				<DefaultButton
					visibleLabel={true}
					callbackClick={handleReset}
				/>
			</li>
		</ul>
	);
};

export default CalendarWeekSettingEditor;

