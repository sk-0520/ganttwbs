import { FC, useContext, useEffect, useState } from "react";

import PlainColorPicker from "@/components/elements/PlainColorPicker";
import { useLocale } from "@/locales/locale";
import { Color } from "@/models/Color";
import { MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { Prices } from "@/models/data/Prices";
import { GroupId, MemberId } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { Strings } from "@/models/Strings";

interface Props {
	groupId: GroupId,
	memberId: MemberId,
	members: ReadonlyArray<Readonly<MemberSetting>>,
	updatedColors: ReadonlyMap<MemberId, Color>;
	callbackRemoveMember(member: MemberId): void;
}

const MemberEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const member = getMember(props.groupId, props.memberId, settingContext);

	const priceSetting = DefaultSettings.getPriceSetting();

	const [name, setName] = useState(member.name);
	const [priceCost, setPriceCost] = useState(member.priceCost);
	const [priceSales, setPriceSales] = useState(member.priceSales);
	const [monthCost, setMonthCost] = useState(member.priceCost * priceSetting.workingDays);
	const [monthSales, setMonthSales] = useState(member.priceSales * priceSetting.workingDays);
	const [displayRate, setDisplayRate] = useState("---%");
	const [color, setColor] = useState(member.color);

	useEffect(() => {
		const updatedColor = props.updatedColors.get(member.id);
		if (updatedColor) {
			setColor(member.color = updatedColor);
		}
	}, [member, props.updatedColors]);

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
				.filter(a => a.id !== props.memberId)
				.map(a => a.name)
		);
		const name = Strings.toUniqueDefault(value, memberNames);
		setName(member.name = name);
	}

	function handleChangePriceCost(value: number) {
		setPriceCost(member.priceCost = value);
	}

	function handleChangePriceSales(value: number) {
		setPriceSales(member.priceSales = value);
	}

	function handleChangeTheme(color: Color): void {
		setColor(member.color = color);
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
				{monthCost.toLocaleString()}
			</td>
			<td className="month-sales-cell">
				{monthSales.toLocaleString()}
			</td>
			<td className="rate-cell">
				{displayRate}
			</td>
			<td className="remove-cell">
				<button
					type="button"
					onClick={ev => props.callbackRemoveMember(props.memberId)}
				>
					{locale.common.command.remove}
				</button>
			</td>
		</tr>
	);
};

export default MemberEditor;

function getMember(groupId: GroupId, memberId: MemberId, context: SettingContext): MemberSetting {
	const group = context.groups.find(a => a.id === groupId);
	if (!group) {
		throw new Error();
	}

	const result = group.members.find(a => a.id === memberId);
	if (!result) {
		throw new Error();
	}

	return result;
}
