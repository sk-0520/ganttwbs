import { MemberSetting } from "@/models/data/context/SettingContext";
import { NextPage } from "next";
import { useState } from "react";

interface Props {
	member: MemberSetting;
	callbackRemoveMember(member: MemberSetting): void;
}

const Component: NextPage<Props> = (props: Props) => {

	const [name, setName] = useState(props.member.name);
	const [priceCost, setPriceCost] = useState(props.member.priceCost);
	const [priceSales, setPriceSales] = useState(props.member.priceSales);
	const [color, setColor] = useState(props.member.color);

	function handleChangeName(value: string) {
		setName(props.member.name = value);
	}

	function handleChangePriceCost(value: number) {
		setPriceCost(props.member.priceCost = value);
	}

	function handleChangePriceSales(value: number) {
		setPriceSales(props.member.priceSales = value);
	}

	function handleChangeColor(value: string) {
		setColor(props.member.color = value);
	}

	return (
		<tr>
			<td className="name">
				<input
					defaultValue={name}
					onChange={ev => handleChangeName(ev.target.value)}
				/>
			</td>
			<td className="cost">
				<input
					type="number"
					min={0}
					step={1000}
					defaultValue={priceCost}
					onChange={ev => handleChangePriceCost(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="sales">
				<input
					type="number"
					min={0}
					step={1000}
					defaultValue={priceSales}
					onChange={ev => handleChangePriceSales(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="theme">
				<input
					type="color"
					defaultValue={color}
					onChange={ev => handleChangeColor(ev.target.value)}
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

export default Component;
