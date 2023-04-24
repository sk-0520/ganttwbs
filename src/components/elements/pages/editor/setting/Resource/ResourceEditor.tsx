import { random } from "@ctrl/tinycolor";
import { useContext, MouseEvent, useState, Fragment, FC } from "react";

import GroupColorsDialog from "@/components/elements/pages/editor/setting/Resource/GroupColorsDialog";
import MemberEditor from "@/components/elements/pages/editor/setting/Resource/MemberEditor";
import { GroupSetting, MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";
import { IdFactory } from "@/models/IdFactory";
import GroupsEditor from "@/components/elements/pages/editor/setting/Resource/GroupEditor";

//TODO: data属性の使用はやめれるはず

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
					return (
						<GroupsEditor
							key={a.name}
							group={a}
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

