import { FC, ReactNode } from "react";

import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { AnyTimeline, Member, MemberId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";

interface Props extends ResourceInfoProps {
	readonly currentTimeline: Readonly<AnyTimeline>;
	selectedMemberId: MemberId;
	disabled: boolean;
	callbackChangeMember(memberGroupPair: MemberGroupPair | undefined): void;
}

const ResourceCell: FC<Props> = (props: Props) => {


	function renderMemberOptions(members: ReadonlyArray<Member>): Array<ReactNode> {
		return (
			members.map(a => {
				return (
					<option
						key={a.id}
						value={a.id}
						style={{
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
		<td className='timeline-cell timeline-resource'>
			{Settings.maybeTaskTimeline(props.currentTimeline) && (
				<select
					className="edit"
					disabled={props.disabled}
					defaultValue={props.selectedMemberId}
					onChange={ev => handleChangeOption(ev.target.value)}
				>
					<option></option>

					{props.resourceInfo.groupItems.map(a => {
						const members = props.resourceInfo.memberItems.get(a);
						if(!members) {
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
			)}
		</td>
	);
};

export default ResourceCell;
