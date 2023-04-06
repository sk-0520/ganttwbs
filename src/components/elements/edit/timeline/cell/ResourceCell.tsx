import { Settings } from "@/models/Settings";
import { AnyTimeline, Group, Member, MemberId } from "@/models/data/Setting";
import { NextPage } from "next";
import { ReactNode } from "react";

interface Props {
	currentTimeline: AnyTimeline;
	groups: ReadonlyArray<Group>;
	selectedMemberId: MemberId;
	disabled: boolean;
	callbackChangeMember(memberId: MemberId, memberName: string): void;
}

const Component: NextPage<Props> = (props: Props) => {

	const groups = [...props.groups]
		.sort((a, b) => a.name.localeCompare(b.name))
		;

	function toMemberOptions(members: ReadonlyArray<Member>): Array<ReactNode> {
		return (
			members.map(a => {
				return (
					<option
						key={a.id}
						value={a.id}
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
		<div className='timeline-cell timeline-resource'>
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
										<>{toMemberOptions(members)}</>
									</optgroup>
								)
								: (
									<>{toMemberOptions(members)}</>
								)
						)
					})}
				</select>
			)}
		</div>
	);
};

export default Component;
