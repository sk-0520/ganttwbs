import { NextPage } from "next";
import { useContext, MouseEvent, useState } from "react";
import { SettingContext, GroupSetting } from "@/models/data/context/SettingContext";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);
	console.debug(settingContext);

	const [newGroupName, setNewGroupName] = useState('');

	function handleAddGroup(event: MouseEvent<HTMLButtonElement>) {
		const s = newGroupName.trim();
		if (!s) {
			return;
		}
		const names = settingContext.groups.map(a => a.name);
		if (names.includes(s)) {
			return;
		}

		settingContext.groups.push({
			name: s,
			members: [],
		});
		setNewGroupName('');
	}

	function handleAddMember(groupName: string, event: MouseEvent<HTMLButtonElement>) {
		const index = settingContext.groups.findIndex(a => a.name === groupName);
		if (index === -1) {
			throw new Error();
		}

		const name = 'NEW ' + settingContext.groups[index].members.length;

		// const members = [...settingContext.groups[index].members];
		// members.push({
		// 	id: name,
		// 	display: name,
		// 	color: '#ff0',
		// });
		// settingContext.groups[index].members = members;

		settingContext.groups[index].members.push({
			id: name,
			display: name,
			color: '#ff0',
		});

		console.log(settingContext.groups[index].members);
	}


	return (
		<>
			<dl className="inputs">
				{settingContext.groups.map(a => (
					<>
						<dt key={a.name}>
							<label>
								👥
								<input defaultValue={a.name} />
							</label>
						</dt>

						<dd key={a.name}>
							<dl className="inputs">
								<>
									{a.members.map(b => {
										<>
											<dt>
												<label>
													👤
													<input defaultValue={a.name} />
												</label>
											</dt>
											<dd>
											</dd>
										</>
									})}

									<dt>新規メンバー</dt>
									<dd>
										<input />
										<button onClick={ev => handleAddMember(a.name, ev)}>add</button>
									</dd>
								</>
							</dl>
						</dd>
					</>
				))}
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

