import { useContext, MouseEvent, useState, FC } from "react";

import GroupsEditor from "@/components/elements/pages/editor/setting/Resource/GroupEditor";
import { GroupSetting, SettingContext } from "@/models/data/context/SettingContext";
import { IdFactory } from "@/models/IdFactory";

const ResourceEditor: FC = () => {
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
			key: IdFactory.createReactKey(),
			name: groupName,
			members: [],
		};
		setEditGroups(settingContext.groups = [...editGroups, newGroup]);
		setNewGroupName("");
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

	return (
		<>
			<dl className="inputs">
				{editGroups.map(a => {
					return (
						<GroupsEditor
							key={a.name}
							configuration={settingContext.configuration}
							group={a}
							groups={editGroups}
							callbackRemove={a => handleRemoveGroup(a)}
						/>
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

export default ResourceEditor;

