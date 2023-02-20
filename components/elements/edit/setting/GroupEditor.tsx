import { v4 } from "uuid";
import { NextPage } from "next";
import { useContext, MouseEvent, useState } from "react";
import { GroupSetting, MemberSetting, SettingContext } from "@/models/data/context/SettingContext";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);
	console.debug(settingContext);

	const [newGroupName, setNewGroupName] = useState('');
	const [editGroups, setEditGroups] = useState(settingContext.groups);

	function handleAddGroup(event: MouseEvent<HTMLButtonElement>) {
		const s = newGroupName.trim();
		if (!s) {
			return;
		}

		const names = editGroups.map(a => a.name);
		if (names.includes(s)) {
			return;
		}

		const newGroup = {
			key: v4(),
			name: s,
			members: [],
		};
		setEditGroups([...editGroups, newGroup]);
		setNewGroupName('');
	}

	function handleRemoveGroup(group: GroupSetting, event: MouseEvent<HTMLButtonElement>) {
		const index = editGroups.findIndex(a => a.key === group.key);
		if (index === -1) {
			throw new Error();
		}

		const groups = [];
		for (let i = 0; i < editGroups.length; i++) {
			if (i === index) {
				continue;
			}
			const group = settingContext.groups[i];
			groups.push(group);
		}

		setEditGroups(groups);
	}

	function handleAddMember(group: GroupSetting, memberName: string, event: MouseEvent<HTMLButtonElement>) {
		const index = editGroups.findIndex(a => a.key === group.key);
		if (index === -1) {
			throw new Error();
		}

		const name = memberName.trim();
		if(!name) {
			return;
		}

		const members = [...editGroups[index].members];
		const newMember = {
			key: v4(),
			id: v4(),
			name: name,
			color: '#ff0',
		};
		members.push(newMember);
		editGroups[index].members = members;

		setEditGroups([...editGroups]);
	}

	function handleRemoveMember(group: GroupSetting, member: MemberSetting, event: MouseEvent<HTMLButtonElement>) {
		const groupIndex = editGroups.findIndex(a => a.key === group.key);
		if (groupIndex === -1) {
			throw new Error();
		}

		const memberIndex = editGroups[groupIndex].members.findIndex(a => a.key === member.key);
		if (memberIndex === -1) {
			throw new Error();
		}

		const members = [];
		for (let i = 0; i < editGroups[groupIndex].members.length; i++) {
			if (i === memberIndex) {
				continue;
			}
			const member = settingContext.groups[groupIndex].members[i];
			members.push(member);
		}
		editGroups[groupIndex].members = members;

		setEditGroups([...editGroups]);
	}

	return (
		<>
			<dl className="inputs">
				{editGroups.map(a => {
					let memberName = '';

					return (
						<div key={a.key}>
							<dt >
								<label>
									👥
									<input
										defaultValue={a.name}
										onChange={ev => a.name = ev.target.value}
									/>
									<span className="count">{a.members.length}</span>

									<button onClick={ev => handleRemoveGroup(a, ev)}>remove</button>
								</label>
							</dt>

							<dd>
								<dl className="inputs">
									<>
										{a.members.map(b => {

											return <div key={b.key}>
												<dt >
													<label>
														👤
														<input
															defaultValue={b.name}
															onChange={ev => b.name = ev.target.value}
														/>
														<button type="button" onClick={ev => handleRemoveMember(a, b, ev)}>remove</button>
													</label>
												</dt>
												<dd>
												</dd>
											</div>
										})}

										<dt>新規メンバー</dt>
										<dd>
											<input
												defaultValue={memberName}
												onChange={ev => memberName = ev.target.value}
											/>
											<button type="button" onClick={ev => handleAddMember(a, memberName, ev)}>add</button>
										</dd>
									</>
								</dl>
							</dd>
						</div>
					)
				})}
				<dt>新規グループ</dt>
				<dd>
					<input
						value={newGroupName}
						onChange={ev => setNewGroupName(ev.target.value)}
					/>
					<button type="button" onClick={handleAddGroup}>add</button>
				</dd>
			</dl>
		</>
	)
};

export default Component;

