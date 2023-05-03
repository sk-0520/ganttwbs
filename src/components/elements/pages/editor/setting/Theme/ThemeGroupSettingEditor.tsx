import { TinyColor, random } from "@ctrl/tinycolor";
import { FC, useContext, useState } from "react";

import Dialog from "@/components/elements/Dialog";
import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { Arrays } from "@/models/Arrays";
import { Colors } from "@/models/Colors";
import { SettingContext, UUID } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { useLocale } from "@/locales/locale";
import { Strings } from "@/models/Strings";

const groupThemeColors = DefaultSettings.getGroupThemeColors();

const reset = {
	minimum: 1,
	maximum: groupThemeColors.length * 3,
	default: Math.round((groupThemeColors.length * 3) / 2),
	color: {
		begin: Arrays.first(groupThemeColors),
		end: Arrays.last(groupThemeColors),
	}
} as const;

const ThemeGroupSettingEditor: FC = () => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const [groups, setGroups] = useState(settingContext.theme.groups);
	const [visibleResetColor, setVisibleResetColor] = useState(false);
	const [resetCount, setResetCount] = useState(reset.default);
	const [resetColorBegin, setResetColorBegin] = useState(reset.color.begin);
	const [resetColorEnd, setResetColorEnd] = useState(reset.color.end);

	function handleChangeColor(key: UUID, color: Color) {
		const target = groups.find(a => a.key === key);
		if (!target) {
			throw new Error();
		}
		target.value = color;
	}

	function handleRemoveColor(key: UUID) {
		const items = groups.filter(a => a.key !== key);
		setGroups(settingContext.theme.groups = items);
	}

	function handleAddColor() {
		groups.push({
			key: IdFactory.createReactKey(),
			value: random().toHexString(),
		});
		setGroups(settingContext.theme.groups = [...groups]);
	}

	function handleStartResetColor() {
		setResetCount(groups.length ? groups.length : reset.minimum);
		if (groups.length) {
			setResetColorBegin(groups[0].value);
			if (1 < groups.length) {
				setResetColorEnd(groups[groups.length - 1].value);
			} else {
				setResetColorEnd(random().toHexString());
			}
		} else {
			setResetColorBegin(reset.color.begin);
			setResetColorEnd(reset.color.end);
		}
		setVisibleResetColor(true);
	}

	function handleResetGroups() {
		setResetCount(reset.default);
		setResetColorBegin(reset.color.begin);
		setResetColorEnd(reset.color.end);
	}

	return (
		<>
			<table className="groups">
				<tbody>
					{groups.map((a, i) => {
						return (
							<tr key={a.key}>
								<td>
									{Strings.replaceMap(
										locale.editor.setting.theme.group.levelFormat,
										{
											"LEVEL": (i + 1).toString(),
										}
									)}
								</td>
								<td>
									<PlainColorPicker
										color={a.value}
										callbackChanged={c => handleChangeColor(a.key, c)}
									/>
								</td>
								<td>
									<button
										type='button'
										onClick={ev => handleRemoveColor(a.key)}
									>
										{locale.common.command.remove}
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<td />
						<td>
							<button
								type='button'
								onClick={handleAddColor}
							>
								{locale.common.command.add}
							</button>
						</td>
						<td>
							<button
								type='button'
								onClick={handleStartResetColor}
							>
								{locale.editor.setting.theme.group.collectiveSetting}
							</button>
						</td>
					</tr>
				</tfoot>
			</table>

			{visibleResetColor && (
				<Dialog
					button="submit"
					title={locale.editor.setting.theme.group.collectiveSettingDialog.title}
					callbackClose={r => {
						if (r === "submit") {
							const colors = resetCount <= 1
								? [new TinyColor(resetColorBegin)]
								: Colors.generateGradient(resetColorBegin, resetColorEnd, resetCount)
								;
							const groups = colors.map(a => ({ key: IdFactory.createReactKey(), value: a.toHexString() }));
							setGroups(settingContext.theme.groups = groups);
						}
						setVisibleResetColor(false);
					}}
				>
					<dl className="inputs">
						<dt>
							{locale.editor.setting.theme.group.collectiveSettingDialog.countInfinity}
						</dt>
						<dd>
							<input
								type="number"
								min={reset.minimum}
								value={resetCount}
								onChange={ev => setResetCount(ev.target.valueAsNumber)}
							/>
						</dd>
						<dd
							title={Strings.replaceMap(
								locale.editor.setting.theme.group.collectiveSettingDialog.countFiniteFormat,
								{
									"COUNT": reset.maximum.toString(),
								}
							)}
						>
							<input
								type="range"
								min={reset.minimum}
								max={reset.maximum}
								value={resetCount}
								onChange={ev => setResetCount(ev.target.valueAsNumber)}
							/>
						</dd>

						<dt>
							{locale.editor.setting.theme.group.collectiveSettingDialog.color}
						</dt>
						<dd>
							{/* ブラウザに任せる, ダイアログ内でぶわってするとぶわってなる */}
							<input
								type="color"
								value={resetColorBegin}
								onChange={ev => setResetColorBegin(ev.target.value)}
							/>
							～
							<input
								type="color"
								value={resetColorEnd}
								onChange={ev => setResetColorEnd(ev.target.value)}
							/>
						</dd>

						<dt>&nbsp;</dt>
						<dd>
							<DefaultButton
								visibleLabel={true}
								callbackClick={handleResetGroups}
							/>
						</dd>

					</dl>
				</Dialog >
			)}
		</>
	);

};

export default ThemeGroupSettingEditor;
