import { NextPage } from "next";
import { useContext, useState } from "react";

import { SettingContext, UUID } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";
import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { TinyColor, random } from "@ctrl/tinycolor";
import Dialog from "@/components/elements/Dialog";
import Colors from "@/models/data/Colors";
import { IdFactory } from "@/models/IdFacotory";

const reset = {
	minimum: 1,
	maximum: 100,
	color: {
		begin: "#ff0000" as string,
		end: "#ffff00" as string,
	}
} as const;

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [groups, setGroups] = useState(settingContext.theme.groups);
	const [showResetColor, setShowResetColor] = useState(false);
	const [resetCount, setResetCount] = useState(0);
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
		setShowResetColor(true);
	}

	return (
		<>
			<table className="groups">
				<tbody>
					{groups.map((a, i) => {
						return (
							<tr key={a.key}>
								<td>レベル {i + 1}</td>
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
										remove
									</button>
								</td>
							</tr>
						)
					})}
				</tbody>
				<tfoot>
					<td />
					<td>
						<button
							type='button'
							onClick={handleAddColor}
						>
							末尾追加
						</button>
					</td>
					<td>
						<button
							type='button'
							onClick={handleStartResetColor}
						>
							一括設定
						</button>
					</td>
				</tfoot>
			</table>

			{showResetColor && (
				<Dialog
					button="submit"
					title="一括設定"
					callbackClose={r => {
						if (r === "submit") {
							const colors = resetCount <= 1
								? [new TinyColor(resetColorBegin)]
								: Colors.generateGradation(resetColorBegin, resetColorEnd, resetCount)
								;
							const groups = colors.map(a => ({ key: IdFactory.createReactKey(), value: a.toHexString() }));
							setGroups(settingContext.theme.groups = groups);
						}
						setShowResetColor(false);
					}}
				>
					<dl className="inputs">
						<dt>
							件数
						</dt>
						<dd>
							<input
								type="number"
								min={reset.minimum}
								max={reset.maximum}
								value={resetCount}
								onChange={ev => setResetCount(ev.target.valueAsNumber)}
							/>
						</dd>
						<dd>
							<input
								type="range"
								min={reset.minimum}
								max={reset.maximum}
								value={resetCount}
								onChange={ev => setResetCount(ev.target.valueAsNumber)}
							/>
						</dd>

						<dt>色</dt>
						<dd>
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

					</dl>
				</Dialog >
			)}
		</>
	)

};

export default Component;
