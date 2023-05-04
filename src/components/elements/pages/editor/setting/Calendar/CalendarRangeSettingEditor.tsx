import { FC, useContext } from "react";

import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/data/context/SettingContext";

const CalendarRangeSettingEditor: FC = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	return (
		<p>
			<label>
				{locale.pages.editor.setting.calendar.range.begin}
				<input
					type='date'
					defaultValue={settingContext.calendar.range.from}
					onChange={ev => settingContext.calendar.range.from = ev.target.value}
				/>
			</label>
			<span>～</span>
			<label>
				<input
					type='date'
					defaultValue={settingContext.calendar.range.to}
					onChange={ev => settingContext.calendar.range.to = ev.target.value}
				/>
				{locale.pages.editor.setting.calendar.range.end}
			</label>
		</p>
	);
};

export default CalendarRangeSettingEditor;
