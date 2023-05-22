import { Editor } from "@monaco-editor/react";
import { FC, ReactNode, useContext } from "react";

import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/context/SettingContext";
import { CssHelper } from "@/models/CssHelper";

const CalendarHolidaySettingEditor: FC = () => {
	const settingContext = useContext(SettingContext);
	const locale = useLocale();

	function renderEditor(value: string, callbackChanged: (value: string) => void): ReactNode {
		return (
			<Editor
				className="editor"
				width="40vw"
				height="8em"
				defaultValue={value}
				onChange={ev => callbackChanged(ev ?? "")}
				options={{
					lineNumbers: "off",
					tabSize: 8,
					insertSpaces: false,
					renderWhitespace: "all",
					fontFamily: CssHelper.toFontFamily(locale.styles.editor.fontFamilies),
					quickSuggestions: false,
				}}
			/>
		);
	}

	return (
		<>
			<p>
				{locale.pages.editor.setting.calendar.holiday.description}<br />
				<code className="example">
					YYYY-MM-DD
					&lt;TAB&gt;
					{locale.pages.editor.setting.calendar.holiday.example}</code>
			</p>
			<div className="holiday">
				<div className="holidays">
					<h3>
						{locale.common.calendar.holiday.normal}
					</h3>
					{renderEditor(settingContext.calendar.holiday.events.normal, (s) => settingContext.calendar.holiday.events.normal = s)}
					<p>
						{locale.pages.editor.setting.calendar.holiday.normal.description}
					</p>
				</div>

				<div className="holidays">
					<h3>
						{locale.common.calendar.holiday.special}
					</h3>
					{renderEditor(settingContext.calendar.holiday.events.special, (s) => settingContext.calendar.holiday.events.special = s)}
					<p>
						{locale.pages.editor.setting.calendar.holiday.special.description}
					</p>
				</div>
			</div>
		</>
	);
};

export default CalendarHolidaySettingEditor;
