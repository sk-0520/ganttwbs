import { TinyColor, random } from "@ctrl/tinycolor";
import { CSSProperties, FC, useState } from "react";

import Dialog from "@/components/elements/Dialog";
import { Arrays } from "@/models/Arrays";
import { Colors } from "@/models/Colors";
import { GroupSetting } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";

const ColorKinds = [
	"same",
	"analogy",
	"monochrome",
	"gradient",
	"random"
] as const;
type ColorKind = typeof ColorKinds[number];

interface Props {
	choiceColorGroup: GroupSetting;
	callbackClosed(colors: Map<MemberId, Color>): void
}

const GroupColorsDialog: FC<Props> = (props: Props) => {
	// const [choiceBaseColor, setChoiceBaseColor] = useState<Color>(Arrays.first(props.choiceColorGroup.members).color);
	// const [choiceGradientColor, setChoiceGradientColor] = useState<Color>(Arrays.last(props.choiceColorGroup.members).color);
	// const [choiceColors, setChoiceColors] = useState<Map<MemberId, TinyColor>>(new Map(
	// 	props.choiceColorGroup.members.map(a => [a.id, new TinyColor(a.color)])
	// ));
	const [baseColor, setBaseColor] = useState(new TinyColor(Arrays.first(props.choiceColorGroup.members).color));
	const [gradientColor, setGradientColor] = useState(new TinyColor(Arrays.last(props.choiceColorGroup.members).color));
	const [selectedColorType, setSelectedColorType] = useState<ColorKind>();

	const [colorTable, setColorTable] = useState(createColorTable(props.choiceColorGroup, baseColor, gradientColor));

	function asd(base: TinyColor, gradient: TinyColor) {
		const baseColors = createBaseColorMaps(props.choiceColorGroup, base);
		const gradientColor = createGradientMap(props.choiceColorGroup, base, gradient);
		setColorTable({
			...colorTable,
			gradient: gradientColor,
			...baseColors,
		});
	}

	function handleChangeColorType(kind: ColorKind, checked: boolean): void {
		if (checked) {
			setSelectedColorType(kind);
		}
	}

	function handleGenerateGradient(): void {
		setColorTable({
			...colorTable,
			random: createRandomMap(props.choiceColorGroup, baseColor, gradientColor),
		});
	}

	function handleChangeBaseColor(value: string): void {
		const color = new TinyColor(value);
		setBaseColor(color);
		asd(color, gradientColor);
	}

	function handleChangeGradientColor(value: string): void {
		const color = new TinyColor(value);
		setGradientColor(color);
		asd(baseColor, color);
	}

	return (
		<Dialog
			button="submit"
			title="色選択"
			callbackClose={(type) => {
				//TODO: あとまわし
				if (type === "submit") {
					// const map = new Map([...choiceColors.entries()].map(([k, v]) => [k, v.toHexString()]));
					// props.callbackClosed(map);
				} else {
				}
				props.callbackClosed(new Map());
			}}
		>
			<div className="group-color">
				<ul className="inline color-types">
					<li>
						<label>
							基準色
							<input
								type="color"
								value={baseColor.toHexString()}
								onChange={ev => handleChangeBaseColor(ev.target.value)}
							/>
						</label>

					</li>
					<li>
						<label>
							グラデーション
							<input
								type="color"
								value={gradientColor.toHexString()}
								onChange={ev => handleChangeGradientColor(ev.target.value)}
							/>
						</label>
					</li>
					<li>
						<button
							type="button"
							onClick={handleGenerateGradient}
						>
							ランダム
						</button>
					</li>
				</ul>

				<table className="color-table">
					<thead>
						<tr>
							<th className="member-cell" />
							{ColorKinds.map(a => {
								return (
									<th key={a}>
										<label>
											<input
												type="radio"
												name="color-type"
												value={a}
												checked={selectedColorType === a}
												onChange={ev => handleChangeColorType(a, ev.target.checked)}
											/>
											{a}
										</label>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{props.choiceColorGroup.members.map((a, i) => {
							return (
								<tr key={a.id}>
									<td className="member-cell">
										{a.name}
									</td>
									{ColorKinds.map(b => {
										const color = colorTable[b].get(a.id);
										if (!color) {
											throw new Error(a.id);
										}

										const htmlColor = color.toHexString();
										const style: CSSProperties = {
											color: Colors.getAutoColor(color).toHexString(),
											background: htmlColor,
										};

										return (
											<td
												key={b}
												className="color-cell"
												style={style}
											>
												{htmlColor}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>


			</div>
		</Dialog>
	);
};

export default GroupColorsDialog;

function createBaseColorMaps(group: Readonly<GroupSetting>, baseColor: TinyColor): Record<"same" | "analogy" | "monochrome", Map<MemberId, TinyColor>> {
	return {
		["same"]: new Map(
			group.members.map(a => [a.id, baseColor])
		),
		["analogy"]: new Map(
			baseColor.analogous(group.members.length).map((a, i) => [group.members[i].id, a])
		),
		["monochrome"]: new Map(
			baseColor.monochromatic(group.members.length).map((a, i) => [group.members[i].id, a])
		)
	};
}

function createColorTable(group: GroupSetting, baseColor: TinyColor, gradientColor: TinyColor): Record<ColorKind, Map<MemberId, TinyColor>> {
	const baseColors = createBaseColorMaps(group, baseColor);
	const table: Record<ColorKind, Map<MemberId, TinyColor>> = {
		...baseColors,
		["gradient"]: createGradientMap(group, baseColor, gradientColor),
		["random"]: createRandomMap(group, baseColor, gradientColor),
	};

	return table;
}

function createGradientMap(group: Readonly<GroupSetting>, baseColor: TinyColor, gradientColor: TinyColor): Map<MemberId, TinyColor> {

	if (group.members.length <= 1) {
		return new Map([
			[group.members[0].id, baseColor]
		]);
	}

	return new Map(
		Colors.generateGradient(baseColor, gradientColor, group.members.length)
			.map((a, i) => [group.members[i].id, a])
	);
}

function createRandomMap(group: Readonly<GroupSetting>, baseColor: TinyColor, gradientColor: TinyColor): Map<MemberId, TinyColor> {
	return new Map(
		group.members.map(a => [a.id, random()])
	);
}
