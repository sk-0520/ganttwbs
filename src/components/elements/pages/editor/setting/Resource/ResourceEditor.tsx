import { useContext, MouseEvent, useState, FC } from "react";

import GroupsEditor from "@/components/elements/pages/editor/setting/Resource/GroupEditor";
import { useLocale } from "@/locales/locale";
import { GroupSetting, SettingContext } from "@/models/context/SettingContext";
import { GroupId } from "@/models/data/Setting";
import { IdFactory } from "@/models/IdFactory";

const ResourceEditor: FC = () => {
	const locale = useLocale();
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

		const newGroup: GroupSetting = {
			id: IdFactory.createGroupId(),
			name: groupName,
			members: [],
		};
		setEditGroups(settingContext.groups = [...editGroups, newGroup]);
		setNewGroupName("");
	}

	function handleRemoveGroup(groupId: GroupId) {
		const targetGroup = editGroups.find(a => a.id === groupId);
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
							key={a.id}
							groupId={a.id}
							callbackRemove={a => handleRemoveGroup(a)}
						/>
					);
				})}

				<dt className="group">
					{locale.pages.editor.setting.resource.newGroup}
				</dt>
				<dd>
					<input
						value={newGroupName}
						onChange={ev => setNewGroupName(ev.target.value)}
					/>
					<button type="button" onClick={handleAddGroup}>
						{locale.common.command.add}
					</button>
				</dd>
			</dl>
		</>
	);
};

export default ResourceEditor;

