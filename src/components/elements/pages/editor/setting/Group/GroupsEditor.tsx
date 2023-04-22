import { random } from "@ctrl/tinycolor";
import { NextPage } from "next";
import { useContext, MouseEvent, useState, Fragment } from "react";

import GroupColorsDialog from "@/components/elements/pages/editor/setting/Group/GroupColorsDialog";
import MemberEditor from "@/components/elements/pages/editor/setting/Group/MemberEditor";
import { GroupSetting, MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";
import { IdFactory } from "@/models/IdFactory";

//TODO: data属性の使用はやめれるはず

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [newGroupName, setNewGroupName] = useState("");
	const [editGroups, setEditGroups] = useState(settingContext.groups);
	const [choiceColorGroup, setChoiceColorGroup] = useState<GroupSetting | null>(null);
	const [updatedColors, setUpdatedColors] = useState<Map<MemberId, Color>>(new Map());

	function removeMember(group: GroupSetting, member: MemberSetting) {
		const targetGroup = editGroups.find(a => a.key === group.key);
		if (!targetGroup) {
			throw new Error();
		}

		const targetMember = targetGroup.members.find(a => a.key === member.key);
		if (!targetMember) {
			throw new Error();
		}

		const members = [];
		for (const member of targetGroup.members) {
			if (member === targetMember) {
				continue;
			}
			members.push(member);
		}
		targetGroup.members = members;

		setEditGroups([...editGroups]);
	}

	function handleAddGroup(event: MouseEvent<HTMLButtonElement>) {
		const groupName = newGroupName.trim();
		if (!groupName) {
			return;
		}

		const names = editGroups.map(a => a.name);
		if (names.includes(groupName)) {
			return;
		}

		const newGroup = {
			key: IdFactory.createReactKey(),
			name: groupName,
			members: [],
		};
		setEditGroups(settingContext.groups = [...editGroups, newGroup]);
		setNewGroupName("");
	}

	function handleStartChoiceColor(group: GroupSetting): void {
		setChoiceColorGroup(group);
	}

	function handleRemoveGroup(group: GroupSetting) {
		const targetGroup = editGroups.find(a => a.key === group.key);
		if (!targetGroup) {
			throw new Error();
		}

		const groups: Array<GroupSetting> = [];
		for (const group of editGroups) {
			if (group === targetGroup) {
				continue;
			}
			groups.push(group);
		}

		setEditGroups(settingContext.groups = groups);
	}

	function handleAddMember(group: GroupSetting, memberName: string, event: MouseEvent<HTMLButtonElement>) {
		const targetGroup = editGroups.find(a => a.key === group.key);
		if (!targetGroup) {
			throw new Error();
		}

		const name = memberName.trim();
		if (!name) {
			return;
		}

		if (targetGroup.members.some(a => a.name === name)) {
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
		targetGroup.members.push(newMember);

		setEditGroups([...editGroups]);
		const element = event.currentTarget.closest("[data-new-member]")?.querySelector("[name=\"member-name\"]") as HTMLInputElement | undefined;
		if (element) {
			element.value = "";
		}
	}

	return (
		<>
			<dl className="inputs">
				{editGroups.map(a => {
					let memberName = "";

					const handleRemoveMember = (member: MemberSetting) => {
						removeMember(a, member);
					};

					return (
						<Fragment key={a.key}>
							<dt className="group">
								<ul className="inline">
									<li>
										<label>
											グループ名
											<input
												defaultValue={a.name}
												onChange={ev => a.name = ev.target.value}
											/>
											<span className="count">{a.members.length}</span>
										</label>
									</li>
									<li>
										<button
											type="button"
											onClick={ev => handleStartChoiceColor(a)}
										>
											色を割り振り
										</button>
									</li>
									<li className="remove">
										<button
											type="button"
											onClick={ev => handleRemoveGroup(a)}
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
										{a.members.map(b =>
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
													defaultValue={memberName}
													onChange={ev => memberName = ev.target.value}
												/>
											</td>
											<td className="add">
												<button
													type="button"
													onClick={ev => handleAddMember(a, memberName, ev)}
												>
													add
												</button>
											</td>
										</tr>
									</tfoot>
								</table>
							</dd>
						</Fragment>
					);
				})}

				<dt className="group">新規グループ</dt>
				<dd>
					<input
						value={newGroupName}
						onChange={ev => setNewGroupName(ev.target.value)}
					/>
					<button type="button" onClick={handleAddGroup}>add</button>
				</dd>
			</dl>

			{choiceColorGroup && (
				<GroupColorsDialog
					choiceColorGroup={choiceColorGroup}
					callbackClosed={a => {
						//if (type === "submit") {
						//const map = new Map<MemberId, Color>([...choiceColors.entries()].map(([k, v]) => [k, v.toHexString()]));
						setUpdatedColors(a);
						//}
						setChoiceColorGroup(null);
					}} />
			)}
		</>
	);
};

export default Component;

