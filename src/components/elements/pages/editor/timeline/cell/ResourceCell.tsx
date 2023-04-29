import { FC, ReactNode } from "react";

import { AnyTimeline, Group, Member, MemberId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";

interface Props {
	readonly currentTimeline: Readonly<AnyTimeline>;
	groups: ReadonlyArray<Readonly<Group>>;
	selectedMemberId: MemberId;
	disabled: boolean;
	callbackChangeMember(memberId: MemberId, memberName: string): void;
}

const ResourceCell: FC<Props> = (props: Props) => {
	const groups = [...props.groups]
		.sort((a, b) => a.name.localeCompare(b.name))
		;

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
		const member = groups
			.flatMap(a => a.members)
			.find(a => a.id === memberId)
			;

		props.callbackChangeMember(member?.id ?? "", member?.name ?? "");
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

					{groups.map(a => {
						const members = [...a.members]
							.sort((a2, b2) => a2.name.localeCompare(b2.name))
							;

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
