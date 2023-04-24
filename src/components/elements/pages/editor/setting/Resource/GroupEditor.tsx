import MemberEditor from "@/components/elements/pages/editor/setting/Resource/MemberEditor";
import { IdFactory } from "@/models/IdFactory";
import { Color, MemberId } from "@/models/data/Setting";
import { GroupSetting, MemberSetting } from "@/models/data/context/SettingContext";
import { random } from "@ctrl/tinycolor";
import { FC, useState } from "react";

interface Props {
	group: GroupSetting;
	callbackRemove(group: GroupSetting): void;
}

const GroupsEditor: FC<Props> = (props: Props) => {

	const [name, setName] = useState(props.group.name);
	const [members, setMembers] = useState(props.group.members);
	const [choiceColorGroup, setChoiceColorGroup] = useState(props.group);
	const [updatedColors, setUpdatedColors] = useState<Map<MemberId, Color>>(new Map());
	const [newMemberName, setNewMemberName] = useState("");

	function removeMember(member: MemberSetting) {
		const targetMember = props.group.members.find(a => a.key === member.key);
		if (!targetMember) {
			throw new Error();
		}

		const members = [];
		for (const member of props.group.members) {
			if (member === targetMember) {
				continue;
			}
			members.push(member);
		}

		setMembers(props.group.members = members);
	}

	function handleChangeName(name: string): void {
		setName(props.group.name = name);
	}

	function handleStartChoiceColor(group: GroupSetting): void {
		setChoiceColorGroup(group);
	}

	function handleAddMember() {
		const name = newMemberName.trim();
		if (!name) {
			return;
		}

		if (props.group.members.some(a => a.name === name)) {
			return;
		}

		const newMember: MemberSetting = {
			key: IdFactory.createReactKey(),
			id: IdFactory.createMemberId(),
			name: name,
			color: random().toHexString(),
			priceCost: 40000,
			priceSales: 50000,
		};

		members.push(newMember);
		setMembers([...members]);
	}

	const handleRemoveMember = (member: MemberSetting) => {
		removeMember(member);
	};

	return (
		<>
			<dt className="group">
				<ul className="inline">
					<li>
						<label>
							グループ名
							<input
								value={name}
								onChange={ev => handleChangeName(ev.target.value)}
							/>
							<span className="count">{members.length}</span>
						</label>
					</li>
					<li>
						<button
							type="button"
							onClick={ev => handleStartChoiceColor(props.group)}
						>
							色を割り振り
						</button>
					</li>
					<li className="remove">
						<button
							type="button"
							onClick={ev => props.callbackRemove(props.group)}
						>
							remove
						</button>
					</li>
				</ul>
			</dt>

			<dd className="member">
				<table className="members">
					<thead>
						<tr>
							<th className="name">名前</th>
							<th className="cost">原価</th>
							<th className="sales">売上</th>
							<th className="theme">テーマ</th>
							<th className="remove">削除</th>
						</tr>
					</thead>

					<tbody>
						{members.map(b =>
							<MemberEditor
								key={b.key}
								member={b}
								updatedColors={updatedColors}
								callbackRemoveMember={handleRemoveMember}
							/>
						)}
					</tbody>

					<tfoot data-new-member>
						<tr>
							<td className="name">
								<input
									name='member-name'
									value={newMemberName}
									onChange={ev => setNewMemberName(ev.target.value)}
								/>
							</td>
							<td className="add">
								<button
									type="button"
									onClick={ev => handleAddMember()}
								>
									add
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</dd>
		</>
	);
};

export default GroupsEditor;
