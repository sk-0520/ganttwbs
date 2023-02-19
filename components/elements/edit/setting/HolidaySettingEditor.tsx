import { NextPage } from "next";
import { KeyboardEvent, useContext } from "react";
import { SettingContext } from "@/models/data/context/SettingContext";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<>
			<div className="holiday">
				<h3>祝日</h3>
				<textarea
					onKeyDown={handleKeyDown}
					defaultValue={settingContext.calendar.holiday.holidays}
					onChange={ev => settingContext.calendar.holiday.holidays = ev.target.value}
				/>
			</div>

			<div className="holiday">
				<h3>特殊</h3>
				<textarea
					onKeyDown={handleKeyDown}
					defaultValue={settingContext.calendar.holiday.specials}
					onChange={ev => settingContext.calendar.holiday.specials = ev.target.value}
				/>
			</div>
		</>
	);
};

export default Component;

function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
	if (event.key === 'Tab') {
		event.preventDefault();

		var element = event.target as HTMLTextAreaElement;

		// カーソル位置
		var cursorPosition = element.selectionStart;
		// カーソルの左右の文字列値
		var leftString = element.value.substring(0, cursorPosition);
		var rightString = element.value.substring(cursorPosition, element.value.length);

		element.value = leftString + "\t" + rightString;
		// カーソル位置をタブスペースの後ろにする
		element.selectionEnd = cursorPosition + 1;
	}
}
