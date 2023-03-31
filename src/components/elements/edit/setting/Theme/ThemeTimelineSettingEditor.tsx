import { NextPage } from "next";
import { useContext, useState } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [group, setGroup] = useState(settingContext.theme.timeline.group);
	const [defaultGroup, setDefaultGroup] = useState(settingContext.theme.timeline.defaultGroup);
	const [defaultTask, setDefaultTask] = useState(settingContext.theme.timeline.defaultTask);
	const [completed, setCompleted] = useState(settingContext.theme.timeline.completed);

	function handleChangeGroup(color: Color) {
		setDefaultGroup(color);
		settingContext.theme.timeline.group = color;
	}

	function handleChangeDefaultGroup(color: Color) {
		setDefaultGroup(color);
		settingContext.theme.timeline.defaultGroup = color;
	}

	function handleChangeDefaultTask(color: Color) {
		setDefaultTask(color);
		settingContext.theme.timeline.defaultTask = color;
	}

	function handleChangeCompleted(color: Color) {
		setCompleted(color);
		settingContext.theme.timeline.completed = color;
	}

	return (
		<dl className='inputs'>
			<dt>未設定グループ</dt>
			<dd>
				<input
					type='color'
					defaultValue={group}
					onChange={ev => handleChangeGroup(ev.target.value)}
				/>
			</dd>

			<dt>グループライン</dt>
			<dd>
				<input
					type='color'
					defaultValue={defaultGroup}
					onChange={ev => handleChangeDefaultGroup(ev.target.value)}
				/>
			</dd>

			<dt>タスクライン</dt>
			<dd>
				<input
					type='color'
					defaultValue={defaultTask}
					onChange={ev => handleChangeDefaultTask(ev.target.value)}
				/>
			</dd>

			<dt>完了</dt>
			<dd>
				<input
					type='color'
					defaultValue={completed}
					onChange={ev => handleChangeCompleted(ev.target.value)}
				/>
			</dd>
		</dl>
	);
};

export default Component;
