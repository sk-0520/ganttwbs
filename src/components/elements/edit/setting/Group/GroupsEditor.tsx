import { NextPage } from "next";
import { useContext, MouseEvent, useState } from "react";
import { v4 } from "uuid";

import { GroupSetting, MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [newGroupName, setNewGroupName] = useState("");
	const [editGroups, setEditGroups] = useState(settingContext.groups);

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
			key: v4(),
			name: groupName,
			members: [],
		};
		setEditGroups(settingContext.groups = [...editGroups, newGroup]);
		setNewGroupName("");
	}

	function handleRemoveGroup(group: GroupSetting, event: MouseEvent<HTMLButtonElement>) {
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
			key: v4(),
			id: v4(),
			name: name,
			color: "#ff0",
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

	function handleChangeMember(member: MemberSetting, color: Color) {
		member.color = color;
	}

	function handleRemoveMember(group: GroupSetting, member: MemberSetting, event: MouseEvent<HTMLButtonElement>) {
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

	return (
		<>
			<dl className="inputs">
				{editGroups.map(a => {
					let memberName = "";

					return (
						<>
							<dt key={"group-" + a.key} className="group">
								<label>
									グループ名
									<input
										defaultValue={a.name}
										onChange={ev => a.name = ev.target.value}
									/>
									<span className="count">{a.members.length}</span>

									<button onClick={ev => handleRemoveGroup(a, ev)}>remove</button>
								</label>
							</dt>

							<dd key={"member-" + a.key} >
								<table className="members">
									<>
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
											{a.members.map(b => {
												return (
													<tr key={b.key}>
														<td className="name">
															<input
																defaultValue={b.name}
																onChange={ev => b.name = ev.target.value}
															/>
														</td>
														<td className="cost">
															<input
																type="number"
																min={0}
																step={1000}
																defaultValue={b.priceCost}
																onChange={ev => b.priceCost = ev.target.valueAsNumber}
															/>
														</td>
														<td className="sales">
															<input
																type="number"
																min={0}
																step={1000}
																defaultValue={b.priceSales}
																onChange={ev => b.priceSales = ev.target.valueAsNumber}
															/>
														</td>
														<td className="theme">
															<input
																type="color"
																defaultValue={b.color}
																onChange={ev => handleChangeMember(b, ev.target.value)}
															/>
														</td>
														<td className="remove">
															<button
																type="button"
																onClick={ev => handleRemoveMember(a, b, ev)}
															>
																remove
															</button>
														</td>
													</tr>
												);
											})}
										</tbody>

										<tfoot data-new-member>
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
										</tfoot>
									</>
								</table>
							</dd>
						</>
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
		</>
	);
};

export default Component;

