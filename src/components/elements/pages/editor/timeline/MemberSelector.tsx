import { FC, ReactNode } from "react";

import { Color } from "@/models/Color";
import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { Member, MemberId } from "@/models/data/Setting";

interface Props extends ResourceInfoProps {
	className?: string;
	disabled?: boolean;

	defaultValue: MemberId;
	callbackChangeMember(memberGroupPair: MemberGroupPair | undefined): void;
	callbackFocus?(isFocus: boolean): void;
}

const MemberSelector: FC<Props> = (props: Props) => {

	function renderMemberOptions(members: ReadonlyArray<Member>): Array<ReactNode> {
		return (
			members.map(a => {
				return (
					<option
						key={a.id}
						value={a.id}
						style={{
							color: Color.parse(a.color).getAutoColor().toHtml(),
							background: a.color,
						}}
					>
						{a.name}
					</option>
				);
			})
		);
	}

	function handleChangeOption(memberId: MemberId) {
		const pair = props.resourceInfo.memberMap.get(memberId);
		props.callbackChangeMember(pair);
	}

	return (
		<select
			className={props.className}
			disabled={props.disabled}
			defaultValue={props.defaultValue}
			onChange={ev => handleChangeOption(ev.target.value)}
			onFocus={ev => props.callbackFocus ? props.callbackFocus(true): undefined}
			onBlur={ev => props.callbackFocus ? props.callbackFocus(false): undefined}
		>
			<option></option>

			{props.resourceInfo.groupItems.map(a => {
				const members = props.resourceInfo.memberItems.get(a);
				if (!members) {
					return null;
				}

				return (
					a.name ?
						(
							<optgroup key={a.name} label={a.name}>
								<>{renderMemberOptions(members)}</>
							</optgroup>
						)
						: (
							<>{renderMemberOptions(members)}</>
						)
				);
			})}
		</select>
	);
};

export default MemberSelector;
