import { NextPage } from "next";
import { useContext, useState } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";
import PlainColorPicker from "@/components/elements/PlainColorPicker";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [group, setGroup] = useState(settingContext.theme.timeline.group);
	const [defaultGroup, setDefaultGroup] = useState(settingContext.theme.timeline.defaultGroup);
	const [defaultTask, setDefaultTask] = useState(settingContext.theme.timeline.defaultTask);
	const [completed, setCompleted] = useState(settingContext.theme.timeline.completed);

	function handleChangeGroup(color: Color) {
		setGroup(color);
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
		<table className='timeline'>
			<tbody>
				<tr>
					<td>未設定グループ</td>
					<td>
						<PlainColorPicker
							color={group}
							callbackChanged={c => handleChangeGroup(c)}
						/>
					</td>
				</tr>

				<tr>
					<td>グループライン</td>
					<td>
						<PlainColorPicker
							color={defaultGroup}
							callbackChanged={c => handleChangeDefaultGroup(c)}
						/>
					</td>
				</tr>

				<tr>
					<td>タスクライン</td>
					<td>
						<PlainColorPicker
							color={defaultTask}
							callbackChanged={c => handleChangeDefaultTask(c)}
						/>
					</td>
				</tr>

				<tr>
					<td>完了</td>
					<td>
						<PlainColorPicker
							color={completed}
							callbackChanged={c => handleChangeCompleted(c)}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default Component;
