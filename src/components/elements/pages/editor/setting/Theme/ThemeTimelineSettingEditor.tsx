import { FC, useContext, useState } from "react";

import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { SettingContext } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { useLocale } from "@/locales/locale";

const ThemeTimelineSettingEditor: FC = () => {
	const locale = useLocale();
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

	function handleReset() {
		settingContext.theme.timeline = DefaultSettings.getTimelineTheme();

		setGroup(settingContext.theme.timeline.group);
		setDefaultGroup(settingContext.theme.timeline.defaultGroup);
		setDefaultTask(settingContext.theme.timeline.defaultTask);
		setCompleted(settingContext.theme.timeline.completed);
	}

	return (
		<table className='timeline'>
			<tbody>
				<tr>
					<td>
						{locale.editor.setting.theme.timeline.notSetGroup}
					</td>
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
					<td>
						{locale.editor.setting.theme.timeline.notSetTask}
					</td>
					<td>
						<PlainColorPicker
							color={defaultTask}
							callbackChanged={c => handleChangeDefaultTask(c)}
						/>
					</td>
				</tr>

				<tr>
					<td>
						{locale.editor.setting.theme.timeline.complete}
					</td>
					<td>
						<PlainColorPicker
							color={completed}
							callbackChanged={c => handleChangeCompleted(c)}
						/>
					</td>
				</tr>

				<tr>
					<td></td>
					<td>
						<DefaultButton
							visibleLabel={true}
							callbackClick={handleReset}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ThemeTimelineSettingEditor;
