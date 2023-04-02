import { NextPage } from "next";
import { useContext } from "react";

import { Forms } from "@/models/Forms";
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
					<textarea
						className='editor'
						onKeyDown={Forms.handleKeyDown}
						defaultValue={settingContext.calendar.holiday.events.holidays}
						onChange={ev => settingContext.calendar.holiday.events.holidays = ev.target.value}
					/>
					<div>
						<button>どっかからとってくる系</button>
					</div>
				</div>

				<div className="holidays">
					<h3>特殊</h3>
					<textarea
						className='editor'
						onKeyDown={Forms.handleKeyDown}
						defaultValue={settingContext.calendar.holiday.events.specials}
						onChange={ev => settingContext.calendar.holiday.events.specials = ev.target.value}
					/>
				</div>
			</div>
		</>
	);
};

export default Component;
