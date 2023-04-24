import { TinyColor, random } from "@ctrl/tinycolor";
import { CSSProperties, FC, useState } from "react";

import Dialog from "@/components/elements/Dialog";
import { Arrays } from "@/models/Arrays";
import { Colors } from "@/models/Colors";
import { GroupSetting } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";

type ColorKind = "same" | "analogy" | "monochrome" | "gradient" | "random";

interface Props {
	choiceColorGroup: GroupSetting;
	callbackClosed(colors: Map<MemberId, Color>): void
}

const GroupColorsDialog: FC<Props> = (props: Props) => {
	const [choiceBaseColor, setChoiceBaseColor] = useState<Color>(Arrays.first(props.choiceColorGroup.members).color);
	const [choiceGradientColor, setChoiceGradientColor] = useState<Color>(Arrays.last(props.choiceColorGroup.members).color);
	const [choiceColors, setChoiceColors] = useState<Map<MemberId, TinyColor>>(new Map(
		props.choiceColorGroup.members.map(a => [a.id, new TinyColor(a.color)])
	));

	const colorKinds: ReadonlyArray<ColorKind> = [
		"same",
		"analogy",
		"monochrome",
		"gradient",
		"random",
	];

	function handleSelectColorKind(colorKind: ColorKind, group: GroupSetting): void {
		const colorMap = new Map<MemberId, TinyColor>();
		const baseColor = new TinyColor(choiceBaseColor);

		switch (colorKind) {
			case "same":
				for (const member of group.members) {
					colorMap.set(member.id, baseColor);
				}
				break;

			case "analogy":
				{
					const colors = baseColor.analogous(group.members.length);
					for (let i = 0; i < colors.length; i++) {
						colorMap.set(group.members[i].id, colors[i]);
					}
				}
				break;

			case "monochrome":
				{
					const colors = baseColor.monochromatic(group.members.length);
					for (let i = 0; i < colors.length; i++) {
						colorMap.set(group.members[i].id, colors[i]);
					}
				}
				break;

			case "gradient":
				{
					if (group.members.length <= 1) {
						colorMap.set(group.members[0].id, baseColor);
					} else {
						const colors = Colors.generateGradient(baseColor, new TinyColor(choiceGradientColor), group.members.length);
						for (let i = 0; i < colors.length; i++) {
							colorMap.set(group.members[i].id, colors[i]);
						}
					}
				}
				break;

			case "random":
				for (const member of group.members) {
					const color = random();
					colorMap.set(member.id, color);
				}
				break;

			default:
				throw new Error();
		}

		setChoiceColors(colorMap);
	}

	return (
		<Dialog
			button="submit"
			title="色選択"
			callbackClose={(type) => {
				if (type === "submit") {
					const map = new Map([...choiceColors.entries()].map(([k, v]) => [k, v.toHexString()]));
					props.callbackClosed(map);
				} else {
					props.callbackClosed(new Map());
				}
			}}
		>
			<>
				<label>
					基準色
					<input
						type="color"
						value={choiceBaseColor}
						onChange={ev => setChoiceBaseColor(ev.target.value)}
					/>
				</label>
				<label>
					グラデーション
					<input
						type="color"
						value={choiceGradientColor}
						onChange={ev => setChoiceGradientColor(ev.target.value)}
					/>
				</label>

				<ul className="inline">
					{colorKinds.map(a => {
						return (
							<li key={a}>
								<label>
									<button
										type="button"
										onClick={ev => handleSelectColorKind(a, props.choiceColorGroup)}
									>
										{a}
									</button>
								</label>
							</li>
						);
					})}
				</ul>
				<table className="color-example">
					<tbody>
						{
							[...choiceColors.entries()].map(([k, v]) => {
								const member = props.choiceColorGroup.members.find(a => a.id === k);
								if (!member) {
									console.warn("MEMBER", k);
									return <></>;
								}

								const color = v.toHexString();
								const style: CSSProperties = {
									color: Colors.getAutoColor(color).toHexString(),
									background: color,
								};

								return (
									<tr key={member.key}>
										<td>
											{member.name}
										</td>
										<td style={style}>
											{color}
										</td>
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</>
		</Dialog>
	);
};

export default GroupColorsDialog;
