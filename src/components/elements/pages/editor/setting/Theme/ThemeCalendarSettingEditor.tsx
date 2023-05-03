import { FC, useContext, useState } from "react";

import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/data/context/SettingContext";
import { Color, WeekDay } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { Settings } from "@/models/Settings";

const ThemeCalendarSettingEditor: FC = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const weekDays = Settings.getWeekDays();

	const [holidayRegulars, setHolidayRegulars] = useState(settingContext.theme.holiday.regulars);
	const [holidayEvents, setHolidayEvents] = useState(settingContext.theme.holiday.events);

	function handleSetRegularColor(week: WeekDay, color: Color) {
		holidayRegulars[week] = color;
		setHolidayRegulars(settingContext.theme.holiday.regulars = { ...holidayRegulars });
	}

	function handleSetHolidayEventColor(event: "holiday" | "special", color: Color) {
		settingContext.theme.holiday.events[event] = color;
		setHolidayEvents({ ...holidayEvents });
	}

	function handleResetRegular() {
		const weekDays = Settings.getWeekDays()
			.map(a => ({ [a]: DefaultSettings.BusinessWeekdayColor }))
			.reduce((r, a) => ({ ...r, ...a }))
			;
		const defaultRegulars = [...DefaultSettings.getRegularHolidays()]
			.map(([k, v]) => ({ [k]: v }))
			.reduce((r, a) => ({ ...r, ...a }))
			;

		const defaultWeeks = {
			...weekDays,
			...defaultRegulars,
		} as { [key in WeekDay]: Color };

		setHolidayRegulars(
			settingContext.theme.holiday.regulars = defaultWeeks
		);
	}

	function handleResetHoliday() {
		setHolidayEvents(
			settingContext.theme.holiday.events = { ...DefaultSettings.getEventHolidayColors() },
		);
	}

	return (
		<table className="holiday">
			<tbody>
				{weekDays.map((a, i) => {
					const renderWeek = (week: WeekDay) => {
						return (
							<>
								<td className="subject">
									{locale.common.calendar.week.long[week]}
								</td>
								<td className="theme">
									<PlainColorPicker
										color={holidayRegulars[week]}
										callbackChanged={c => handleSetRegularColor(week, c)}
									/>
								</td>
							</>
						);
					};

					return (
						<tr key={a}>
							{
								i ? (
									renderWeek(a)
								) : (
									<>
										<td className="header" rowSpan={weekDays.length + 1}>
											{locale.common.calendar.week.name}
										</td>
										{renderWeek(a)}
									</>
								)
							}
						</tr>
					);
				})}
				<tr>
					<td className="subject"></td>
					<td className="theme">
						<DefaultButton
							visibleLabel={true}
							callbackClick={handleResetRegular}
						/>
					</td>
				</tr>

				<tr>
					<td className="header" rowSpan={2}>
						{locale.common.calendar.holiday.name}
					</td>
					<td className="subject">
						{locale.common.calendar.holiday.normal}
					</td>
					<td className="theme">
						<PlainColorPicker
							color={holidayEvents.holiday}
							callbackChanged={c => handleSetHolidayEventColor("holiday", c)}
						/>
					</td>
				</tr>
				<tr>
					<td className="subject">
						{locale.common.calendar.holiday.special}
					</td>
					<td className="theme">
						<PlainColorPicker
							color={holidayEvents.special}
							callbackChanged={c => handleSetHolidayEventColor("special", c)}
						/>
					</td>
				</tr>
				<tr>
					<td className="header"></td>
					<td className="subject"></td>
					<td className="theme">
						<DefaultButton
							visibleLabel={true}
							callbackClick={handleResetHoliday}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ThemeCalendarSettingEditor;
