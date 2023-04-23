import { NextPage } from "next";
import { useContext } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";

const CalendarRangeSettingEditor: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<p>
			<label>
				開始
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
				終了
			</label>
		</p>
	);
};

export default CalendarRangeSettingEditor;
