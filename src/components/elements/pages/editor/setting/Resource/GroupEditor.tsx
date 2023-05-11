import { FC, useContext, useState } from "react";

import GroupColorsDialog from "@/components/elements/pages/editor/setting/Resource/GroupColorsDialog";
import MemberEditor from "@/components/elements/pages/editor/setting/Resource/MemberEditor";
import { useLocale } from "@/locales/locale";
import { Arrays } from "@/models/Arrays";
import { Color } from "@/models/Color";
import { MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { GroupId, MemberId } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { Strings } from "@/models/Strings";

interface Props {
	groupId: GroupId;
	callbackRemove(groupId: GroupId): void;
}

const GroupsEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const settingContext = useContext(SettingContext);

	const group = Arrays.find(settingContext.groups, a => a.id === props.groupId);

	const [groupName, setGroupName] = useState(group.name);
	const [members, setMembers] = useState(sortMembers(group.members));
	const [updatedColors, setUpdatedColors] = useState<Map<MemberId, Color>>(new Map());
	const [newMemberName, setNewMemberName] = useState("");
	const [visibleDialog, setVisibleDialog] = useState(false);

	function handleChangeName(value: string): void {
		const groupNames = new Set(
			settingContext.groups
				.filter(a => a.id !== props.groupId)
				.map(a => a.name)
		);
		const name = Strings.toUniqueDefault(value, groupNames);
		setGroupName(group.name = name);
	}

	function handleStartChoiceColor(): void {
		setVisibleDialog(true);
	}

	function handleAddMember() {
		const name = newMemberName.trim();
		if (!name) {
			return;
		}

		if (group.members.some(a => a.name === name)) {
			return;
		}

		const priceSetting = DefaultSettings.getPriceSetting();

		const newMember: MemberSetting = {
			id: IdFactory.createMemberId(),
			name: name,
			color: Color.random(),
			priceCost: priceSetting.price.cost,
			priceSales: priceSetting.price.sales,
		};

		setMembers(group.members = sortMembers([...members, newMember]));
		setNewMemberName("");
	}

	const handleRemoveMember = (memberId: MemberId) => {
		const newMembers = members.filter(a => a.id !== memberId);
		setMembers(group.members = sortMembers(newMembers));
	};

	return (
		<>
			<dt className="group">
				<ul className="inline">
					<li>
						<label>
							{locale.pages.editor.setting.resource.groupName}
							<input
								value={groupName}
								onChange={ev => handleChangeName(ev.target.value)}
							/>
							<span className="count">{members.length}</span>
						</label>
					</li>
					<li>
						<button
							type="button"
							onClick={ev => handleStartChoiceColor()}
							disabled={members.length <= 1}
						>
							{locale.pages.editor.setting.resource.choiceColor}
						</button>
					</li>
					<li className="remove">
						<button
							type="button"
							onClick={ev => props.callbackRemove(props.groupId)}
						>
							{locale.common.command.remove}
						</button>
					</li>
				</ul>
			</dt>

			<dd className="member">
				<table className="members">
					<thead>
						<tr>
							<th className="name-cell">
								{locale.pages.editor.setting.resource.columns.memberName}
							</th>
							<th className="cost-cell">
								{Strings.replaceMap(
									locale.pages.editor.setting.resource.columns.costFormat,
									{
										"UNIT": locale.common.calendar.unit.day,
									}
								)}
							</th>
							<th className="sales-cell">
								{Strings.replaceMap(
									locale.pages.editor.setting.resource.columns.salesFormat,
									{
										"UNIT": locale.common.calendar.unit.day,
									}
								)}
							</th>
							<th className="theme-cell">
								{locale.pages.editor.setting.resource.columns.theme}
							</th>
							<th className="month-cost-cell">
								{Strings.replaceMap(
									locale.pages.editor.setting.resource.columns.costFormat,
									{
										"UNIT": locale.common.calendar.unit.month,
									}
								)}
							</th>
							<th className="month-sales-cell">
								{Strings.replaceMap(
									locale.pages.editor.setting.resource.columns.salesFormat,
									{
										"UNIT": locale.common.calendar.unit.month,
									}
								)}
							</th>
							<th className="rate-cell">
								{locale.pages.editor.setting.resource.columns.rate}
							</th>
							<th className="remove-cell">
								{locale.common.command.remove}
							</th>
						</tr>
					</thead>

					<tbody>
						{members.map(a =>
							<MemberEditor
								key={a.id}
								groupId={props.groupId}
								memberId={a.id}
								members={members}
								updatedColors={updatedColors}
								callbackRemoveMember={a => handleRemoveMember(a)}
							/>
						)}
					</tbody>

					<tfoot>
						<tr>
							<td className="name-cell">
								<input
									name="member-name"
									value={newMemberName}
									placeholder={locale.pages.editor.setting.resource.newMember}
									onChange={ev => setNewMemberName(ev.target.value)}
								/>
							</td>
							<td className="add-cell">
								<button
									type="button"
									onClick={ev => handleAddMember()}
								>
									{locale.common.command.add}
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
				{visibleDialog && (
					<GroupColorsDialog
						group={group}
						callbackClosed={a => {
							if (a) {
								setUpdatedColors(a);
							}
							setVisibleDialog(false);
						}}
					/>
				)}
			</dd>
		</>
	);
};

export default GroupsEditor;

// function getGroup(groupId: GroupId, context: SettingContext): GroupSetting {
// 	const result = context.groups.find(a => a.id === groupId);
// 	if (!result) {
// 		throw new Error();
// 	}

// 	return result;
// }

function sortMemberCore(a: Readonly<MemberSetting>, b: Readonly<MemberSetting>): number {
	return a.name.localeCompare(b.name);
}

function sortMembers(member: Array<Readonly<MemberSetting>>): Array<MemberSetting> {
	return member.sort((a, b) => sortMemberCore(a, b));
}
