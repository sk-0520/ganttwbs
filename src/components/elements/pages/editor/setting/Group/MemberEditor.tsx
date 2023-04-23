import { NextPage } from "next";
import { useEffect, useState } from "react";

import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { MemberSetting } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";

interface Props {
	member: MemberSetting;
	updatedColors: ReadonlyMap<MemberId, Color>;
	callbackRemoveMember(member: MemberSetting): void;
}

const MemberEditor: NextPage<Props> = (props: Props) => {

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
		setName(props.member.name = value);
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
					min={0}
					step={1000}
					value={priceCost}
					onChange={ev => handleChangePriceCost(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="sales">
				<input
					type="number"
					min={0}
					step={1000}
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
