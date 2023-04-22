import { Editor } from "@monaco-editor/react";
import { NextPage } from "next";
import { ReactNode, useContext } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import { CssHelper } from "@/models/CssHelper";
import { useLocale } from "@/locales/locale";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);
	const locale = useLocale();

	function renderEditor(value: string, callbackChanged: (value: string) => void): ReactNode {
		return (
			<Editor
				className='editor'
				width="40vw"
				height="8em"
				defaultValue={value}
				onChange={ev => callbackChanged(ev ?? "")}
				options={{
					lineNumbers: "off",
					tabSize: 8,
					insertSpaces: false,
					renderWhitespace: "all",
					fontFamily: CssHelper.toFontFamily(locale.font.editor.fontFamilies),
					quickSuggestions: false,
				}}
			/>
		);
	}

	return (
		<>
			<p>
				<code className="example">YYYY-MM-DD&lt;TAB&gt;説明</code> の形で入力してください。
			</p>
			<div className="holiday">
				<div className="holidays">
					<h3>祝日</h3>
					{renderEditor(settingContext.calendar.holiday.events.holidays, (s) => settingContext.calendar.holiday.events.holidays = s)}
					<p>
						国などが定める通常の祝日を設定してください。
					</p>
				</div>

				<div className="holidays">
					<h3>特殊</h3>
					{renderEditor(settingContext.calendar.holiday.events.specials, (s) => settingContext.calendar.holiday.events.specials = s)}
					<p>
						会社の年末年始・夏季休暇などを設定してください。
					</p>
					<p>
						通常の祝日と重複する場合、こちらが優先されます。
					</p>
				</div>
			</div>
		</>
	);
};

export default Component;
