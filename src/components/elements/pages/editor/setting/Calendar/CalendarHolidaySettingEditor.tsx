import { Editor } from "@monaco-editor/react";
import { NextPage } from "next";
import { useContext } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<>
			<p>
				<code className="example">YYYY-MM-DD&lt;TAB&gt;説明</code> の形で入力してください。
			</p>
			<div className="holiday">
				<div className="holidays">
					<h3>祝日</h3>
					<Editor
						className='editor'
						width="40vw"
						height="8em"
						defaultValue={settingContext.calendar.holiday.events.holidays}
						onChange={ev => settingContext.calendar.holiday.events.holidays = ev ?? ""}
					/>
					<p>
						国などが定める通常の祝日を設定してください。
					</p>
				</div>

				<div className="holidays">
					<h3>特殊</h3>
					<Editor
						className='editor'
						width="40vw"
						height="8em"
						defaultValue={settingContext.calendar.holiday.events.holidays}
						onChange={ev => settingContext.calendar.holiday.events.specials = ev ?? ""}
					/>
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
