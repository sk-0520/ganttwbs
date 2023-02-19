import { NextPage } from "next";
import { FormEvent, useContext, useState } from "react";
//import { useForm } from "react-hook-form";
import { EditContext } from "@/models/data/context/EditContext";
import { WeekDay } from "@/models/data/setting/WeekDay";
import { useForm } from "react-hook-form";
import WeekSettingEditor from "./WeekSettingEditor";
import { SettingContext } from "@/models/data/context/SettingContext";
import { Setting } from "@/models/data/setting/Setting";
import * as Storage from "@/models/Storage";

const Component: NextPage = () => {
	const editContext = useContext(EditContext);

	const setting = JSON.parse(JSON.stringify(editContext.data.setting)) as Setting;

	function onSubmit(event: FormEvent) {
		event.preventDefault();
		editContext.data.setting = setting;
		console.debug(setting);
		Storage.saveEditData(editContext.data);
	}

	return (
		<SettingContext.Provider value={setting}>
			<form onSubmit={onSubmit}>
				<section>
					<h2>メンバー</h2>
				</section>
				<section>
					<h2>カレンダー</h2>
					<section>
						<h3>曜日設定</h3>
						<WeekSettingEditor />
					</section>
				</section>
				<section>
					<h2>テーマ</h2>
				</section>

				<button>submit</button>
			</form>
		</SettingContext.Provider>
	);
};

export default Component;
