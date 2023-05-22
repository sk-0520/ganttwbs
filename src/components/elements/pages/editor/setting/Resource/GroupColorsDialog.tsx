import { CSSProperties, FC, useState } from "react";

import Dialog from "@/components/elements/Dialog";
import { useLocale } from "@/locales/locale";
import { Arrays } from "@/models/Arrays";
import { Color } from "@/models/Color";
import { GroupSetting } from "@/models/context/SettingContext";
import { MemberId } from "@/models/data/Setting";
import { Require } from "@/models/Require";

const ColorKinds = [
	"same",
	"analogy",
	"monochrome",
	"gradient",
	"random"
] as const;
type ColorKind = typeof ColorKinds[number];

interface Props {
	group: GroupSetting;
	callbackClosed(colors: Map<MemberId, Color> | undefined): void
}

const GroupColorsDialog: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const [baseColor, setBaseColor] = useState(Arrays.first(props.group.members).color);
	const [gradientColor, setGradientColor] = useState(Arrays.last(props.group.members).color);
	const [selectedColorType, setSelectedColorType] = useState<ColorKind>();

	const [colorTable, setColorTable] = useState(createColorTable(props.group, baseColor, gradientColor));

	function changeInputColors(base: Color, gradient: Color) {
		const baseColors = createBaseColorMaps(props.group, base);
		const gradientColor = createGradientMap(props.group, base, gradient);
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

	function handleGenerateRandom(): void {
		setColorTable({
			...colorTable,
			random: createRandomMap(props.group, baseColor, gradientColor),
		});
		setSelectedColorType("random");
	}

	function handleChangeBaseColor(value: string): void {
		const color = Color.parse(value);
		setBaseColor(color);
		changeInputColors(color, gradientColor);

		const needChangeTypes: Array<ColorKind> = ["random", "gradient"];
		if (!selectedColorType || needChangeTypes.includes(selectedColorType)) {
			setSelectedColorType("analogy");
		}
	}

	function handleChangeGradientColor(value: string): void {
		const color = Color.parse(value);
		setGradientColor(color);
		changeInputColors(baseColor, color);
		setSelectedColorType("gradient");
	}

	return (
		<Dialog
			button="submit"
			title={locale.pages.editor.setting.resource.choiceColorDialog.title}
			preSubmit={() => Boolean(selectedColorType)}
			callbackClose={(type) => {
				if (selectedColorType && type === "submit") {
					props.callbackClosed(colorTable[selectedColorType]);
				} else {
					props.callbackClosed(undefined);
				}
			}}
		>
			<div className="group-color">
				<ul className="inline color-types">
					<li>
						<label>
							{locale.pages.editor.setting.resource.choiceColorDialog.baseColor}
							<input
								type="color"
								value={baseColor.toHtml()}
								onChange={ev => handleChangeBaseColor(ev.target.value)}
							/>
						</label>

					</li>
					<li>
						<label>
							{locale.pages.editor.setting.resource.choiceColorDialog.gradientColor}
							<input
								type="color"
								value={gradientColor.toHtml()}
								onChange={ev => handleChangeGradientColor(ev.target.value)}
							/>
						</label>
					</li>
					<li>
						<button
							type="button"
							onClick={handleGenerateRandom}
						>
							{locale.pages.editor.setting.resource.choiceColorDialog.resetRandomColor}
						</button>
					</li>
				</ul>

				<table className="color-table">
					<thead>
						<tr>
							<th className="member-cell" />
							{ColorKinds.map(a => {
								return (
									<th key={a} className="color-cell">
										<label>
											<input
												type="radio"
												name="color-type"
												value={a}
												checked={selectedColorType === a}
												onChange={ev => handleChangeColorType(a, ev.target.checked)}
											/>
											{locale.pages.editor.setting.resource.choiceColorDialog.kinds[a]}
										</label>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{props.group.members.map((a, i) => {
							return (
								<tr key={a.id}>
									<td className="member-cell">
										{a.name}
									</td>
									{ColorKinds.map(b => {
										const color = Require.get(colorTable[b], a.id);

										const htmlColor = color.toHtml();
										const style: CSSProperties = {
											color: color.getAutoColor().toHtml(),
											background: htmlColor,
										};

										return (
											<td
												key={b}
												className="color-cell"
											>
												<div
													className="color"
													style={style}
												>
													{htmlColor}
												</div>
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

function createBaseColorMaps(group: Readonly<GroupSetting>, baseColor: Color): Record<"same" | "analogy" | "monochrome", Map<MemberId, Color>> {
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

function createColorTable(group: GroupSetting, baseColor: Color, gradientColor: Color): Record<ColorKind, Map<MemberId, Color>> {
	const baseColors = createBaseColorMaps(group, baseColor);
	const table: Record<ColorKind, Map<MemberId, Color>> = {
		...baseColors,
		["gradient"]: createGradientMap(group, baseColor, gradientColor),
		["random"]: createRandomMap(group, baseColor, gradientColor),
	};

	return table;
}

function createGradientMap(group: Readonly<GroupSetting>, baseColor: Color, gradientColor: Color): Map<MemberId, Color> {

	if (group.members.length <= 1) {
		return new Map([
			[group.members[0].id, baseColor]
		]);
	}

	return new Map(
		Color.generateGradient(baseColor, gradientColor, group.members.length)
			.map((a, i) => [group.members[i].id, a])
	);
}

function createRandomMap(group: Readonly<GroupSetting>, baseColor: Color, gradientColor: Color): Map<MemberId, Color> {
	return new Map(
		group.members.map(a => [a.id, Color.random()])
	);
}
