import { FC, useContext } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import { useLocale } from "@/locales/locale";

const CalendarRangeSettingEditor: FC = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	return (
		<p>
			<label>
				{locale.editor.setting.calendar.range.begin}
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
				{locale.editor.setting.calendar.range.end}
			</label>
		</p>
	);
};

export default CalendarRangeSettingEditor;
