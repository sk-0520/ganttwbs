import { NextPage } from "next";
import { useContext, useState } from "react";

import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/data/context/SettingContext";
import { Color, WeekDay } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";

const ThemeCalendarSettingEditor: NextPage = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const weekDays = Settings.getWeekDays();

	const [holidayRegulars, setHolidayRegulars] = useState(settingContext.theme.holiday.regulars);
	const [holidayEvents, setHolidayEvents] = useState(settingContext.theme.holiday.events);

	function handleSetRegularColor(week: WeekDay, color: Color) {
		holidayRegulars[week] = color;
		setHolidayRegulars(holidayRegulars);
	}

	function handleSetHolidayEventColor(event: "holiday" | "special", color: Color) {
		holidayEvents[event] = color;
		setHolidayEvents(holidayEvents);
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
										<td className="header" rowSpan={weekDays.length}>
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
					<td className="header" rowSpan={2}>祝日</td>
					<td className="subject">通常</td>
					<td className="theme">
						<PlainColorPicker
							color={holidayEvents.holiday}
							callbackChanged={c => handleSetHolidayEventColor("holiday", c)}
						/>
					</td>
				</tr>
				<tr>
					<td className="subject">特殊</td>
					<td className="theme">
						<PlainColorPicker
							color={holidayEvents.special}
							callbackChanged={c => handleSetHolidayEventColor("special", c)}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ThemeCalendarSettingEditor;
