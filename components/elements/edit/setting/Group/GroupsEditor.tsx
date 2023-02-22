import { NextPage } from 'next';
import { useContext, MouseEvent, useState } from 'react';
import { v4 } from 'uuid';
import { GroupSetting, MemberSetting, SettingContext } from '@/models/data/context/SettingContext';

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);
	console.debug(settingContext);

	const [newGroupName, setNewGroupName] = useState('');
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
		setNewGroupName('');
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

		const newMember = {
			key: v4(),
			id: v4(),
			name: name,
			color: '#ff0',
		};
		targetGroup.members.push(newMember);

		setEditGroups([...editGroups]);
		const element = event.currentTarget.closest('[data-root]')?.querySelector('[name="member-name"]') as HTMLInputElement | undefined;
		if (element) {
			element.value = '';
		}
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
											</div>;
										})}

										<dt>新規メンバー</dt>
										<dd data-root>
											<input
												name='member-name'
												defaultValue={memberName}
												onChange={ev => memberName = ev.target.value}
											/>
											<button type="button" onClick={ev => handleAddMember(a, memberName, ev)}>add</button>
										</dd>
									</>
								</dl>
							</dd>
						</div>
					);
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
	);
};

export default Component;

