import { FC, useContext, useState } from "react";

import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";

const ThemeTimelineSettingEditor: FC = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const [defaultGroup, setDefaultGroup] = useState(settingContext.theme.timeline.defaultGroup);
	const [defaultTask, setDefaultTask] = useState(settingContext.theme.timeline.defaultTask);
	const [completed, setCompleted] = useState(settingContext.theme.timeline.completed);

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

		setDefaultGroup(settingContext.theme.timeline.defaultGroup);
		setDefaultTask(settingContext.theme.timeline.defaultTask);
		setCompleted(settingContext.theme.timeline.completed);
	}

	return (
		<table className='timeline'>
			<tbody>
				<tr>
					<td>
						{locale.editor.setting.theme.timeline.defaultGroup}
					</td>
					<td>
						<PlainColorPicker
							color={defaultGroup}
							callbackChanged={c => handleChangeDefaultGroup(c)}
						/>
					</td>
				</tr>

				<tr>
					<td>
						{locale.editor.setting.theme.timeline.defaultTask}
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
						{locale.editor.setting.theme.timeline.completed}
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
