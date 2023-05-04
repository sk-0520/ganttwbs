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
					defaultValue={settingContext.calendar.range.begin}
					onChange={ev => settingContext.calendar.range.begin = ev.target.value}
				/>
			</label>
			<span>～</span>
			<label>
				<input
					type='date'
					defaultValue={settingContext.calendar.range.end}
					onChange={ev => settingContext.calendar.range.end = ev.target.value}
				/>
				{locale.pages.editor.setting.calendar.range.end}
			</label>
		</p>
	);
};

export default CalendarRangeSettingEditor;
