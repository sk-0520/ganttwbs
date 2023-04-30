import { FC, useEffect, useState } from "react";

import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { MemberSetting } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";
import { Strings } from "@/models/Strings";
import { DefaultSettings } from "@/models/DefaultSettings";
import { Prices } from "@/models/data/Prices";

const priceSetting = DefaultSettings.getPriceSetting();

interface Props {
	member: MemberSetting;
	members: ReadonlyArray<Readonly<MemberSetting>>,
	updatedColors: ReadonlyMap<MemberId, Color>;
	callbackRemoveMember(member: MemberSetting): void;
}

const MemberEditor: FC<Props> = (props: Props) => {

	const priceSetting = DefaultSettings.getPriceSetting();

	const [name, setName] = useState(props.member.name);
	const [priceCost, setPriceCost] = useState(props.member.priceCost);
	const [priceSales, setPriceSales] = useState(props.member.priceSales);
	const [monthCost, setMonthCost] = useState(props.member.priceCost * priceSetting.workingDays);
	const [monthSales, setMonthSales] = useState(props.member.priceSales * priceSetting.workingDays);
	const [displayRate, setDisplayRate] = useState("---%");
	const [color, setColor] = useState(props.member.color);

	useEffect(() => {
		const color = props.updatedColors.get(props.member.id);
		if (color) {
			setColor(props.member.color = color);
		}
	}, [props.member, props.updatedColors]);

	useEffect(() => {
		setMonthCost(priceCost * priceSetting.workingDays);
	}, [priceCost, priceSetting]);

	useEffect(() => {
		setMonthSales(priceSales * priceSetting.workingDays);
	}, [priceSales, priceSetting]);

	useEffect(() => {
		const rate = Prices.displayPercent(priceSales, priceCost);
		setDisplayRate(rate);
	}, [priceCost, priceSales]);

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

	function handleChangeTheme(color: Color): void {
		setColor(props.member.color = color);
	}

	return (
		<tr>
			<td className="name-cell">
				<input
					value={name}
					onChange={ev => handleChangeName(ev.target.value)}
				/>
			</td>
			<td className="cost-cell">
				<input
					type="number"
					min={priceSetting.input.cost.minimum}
					max={priceSetting.input.cost.maximum}
					step={priceSetting.input.cost.step}
					value={priceCost}
					onChange={ev => handleChangePriceCost(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="sales-cell">
				<input
					type="number"
					min={priceSetting.input.sales.minimum}
					max={priceSetting.input.sales.maximum}
					step={priceSetting.input.sales.step}
					value={priceSales}
					onChange={ev => handleChangePriceSales(ev.target.valueAsNumber)}
				/>
			</td>
			<td className="theme-cell">
				<PlainColorPicker
					color={color}
					callbackChanged={c => handleChangeTheme(c)}
				/>
			</td>
			<td className="month-cost-cell">
				{monthCost}
			</td>
			<td className="month-sales-cell">
				{monthSales}
			</td>
			<td className="rate-cell">
				{displayRate}
			</td>
			<td className="remove-cell">
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
