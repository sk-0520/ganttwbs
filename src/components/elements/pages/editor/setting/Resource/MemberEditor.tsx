import { FC, useEffect, useState } from "react";

import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { MemberSetting } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";
import { Strings } from "@/models/Strings";
import { DefaultSettings } from "@/models/DefaultSettings";

const priceSetting = DefaultSettings.getPriceSetting();

interface Props {
	member: MemberSetting;
	members: ReadonlyArray<Readonly<MemberSetting>>,
	updatedColors: ReadonlyMap<MemberId, Color>;
	callbackRemoveMember(member: MemberSetting): void;
}

const MemberEditor: FC<Props> = (props: Props) => {

	const [name, setName] = useState(props.member.name);
	const [priceCost, setPriceCost] = useState(props.member.priceCost);
	const [priceSales, setPriceSales] = useState(props.member.priceSales);
	const [color, setColor] = useState(props.member.color);

	useEffect(() => {
		const color = props.updatedColors.get(props.member.id);
		if (color) {
			setColor(props.member.color = color);
		}
	}, [props.member, props.updatedColors]);

	function handleChangeName(value: string) {
		const memberNames = new Set(
			props.members
				.filter(a => a.id !== props.member.id)
				.map(a => a.name)
		);
		const name = Strings.toUniqueDefault(value, memberNames);
		setName(props.member.name = name);
	}

	function handleChangePriceCost(value: number) {
		setPriceCost(props.member.priceCost = value);
	}

	function handleChangePriceSales(value: number) {
		setPriceSales(props.member.priceSales = value);
	}

	return (
		<tr>
			<td className="name">
				<input
					value={name}
					onChange={ev => handleChangeName(ev.target.value)}
				/>
			</td>
			<td className="cost">
				<input
					type="number"
					min={priceSetting.input.cost.minimum}
					max={priceSetting.input.cost.maximum}
					step={priceSetting.input.cost.step}
					value={priceCost}
					onChange={ev => handleChangePriceCost(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="sales">
				<input
					type="number"
					min={priceSetting.input.sales.minimum}
					max={priceSetting.input.sales.maximum}
					step={priceSetting.input.sales.step}
					value={priceSales}
					onChange={ev => handleChangePriceSales(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="theme">
				<PlainColorPicker
					color={color}
					callbackChanged={c => setColor(c)}
				/>
			</td>
			<td className="remove">
				<button
					type="button"
					onClick={ev => props.callbackRemoveMember(props.member)}
				>
					remove
				</button>
			</td>
		</tr>
	);
};

export default MemberEditor;
