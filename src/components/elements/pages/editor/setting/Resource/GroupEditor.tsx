import { random } from "@ctrl/tinycolor";
import { FC, useState } from "react";

import GroupColorsDialog from "@/components/elements/pages/editor/setting/Resource/GroupColorsDialog";
import MemberEditor from "@/components/elements/pages/editor/setting/Resource/MemberEditor";
import { GroupSetting, MemberSetting } from "@/models/data/context/SettingContext";
import { Color, MemberId } from "@/models/data/Setting";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { Strings } from "@/models/Strings";

interface Props {
	group: GroupSetting;
	groups: ReadonlyArray<Readonly<GroupSetting>>,
	callbackRemove(group: GroupSetting): void;
}

const GroupsEditor: FC<Props> = (props: Props) => {

	const [groupName, setGroupName] = useState(props.group.name);
	const [members, setMembers] = useState(sortMembers(props.group.members));
	const [updatedColors, setUpdatedColors] = useState<Map<MemberId, Color>>(new Map());
	const [newMemberName, setNewMemberName] = useState("");
	const [visibleDialog, setVisibleDialog] = useState(false);

	function handleChangeName(value: string): void {
		const groupNames = new Set(
			props.groups
				.filter(a => a !== props.group)
				.map(a => a.name)
		);
		const name = Strings.toUniqueDefault(value, groupNames);
		setGroupName(props.group.name = name);
	}

	function handleStartChoiceColor(): void {
		setVisibleDialog(true);
	}

	function handleAddMember() {
		const name = newMemberName.trim();
		if (!name) {
			return;
		}

		if (props.group.members.some(a => a.name === name)) {
			return;
		}

		const priceSetting = DefaultSettings.getPriceSetting();

		const newMember: MemberSetting = {
			key: IdFactory.createReactKey(),
			id: IdFactory.createMemberId(),
			name: name,
			color: random().toHexString(),
			priceCost: priceSetting.price.cost,
			priceSales: priceSetting.price.sales,
		};

		setMembers(props.group.members = sortMembers([...members, newMember]));
		setNewMemberName("");
	}

	const handleRemoveMember = (member: MemberSetting) => {
		const newMembers = members.filter(a => a.id !== member.id);
		setMembers(props.group.members = sortMembers(newMembers));
	};

	return (
		<>
			<dt className="group">
				<ul className="inline">
					<li>
						<label>
							グループ名
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
							<th className="name-cell">要員名</th>
							<th className="cost-cell">原価(日)</th>
							<th className="sales-cell">単価(日)</th>
							<th className="theme-cell">テーマ</th>
							<th className="month-cost-cell">原価(月)</th>
							<th className="month-sales-cell">単価(月)</th>
							<th className="rate-cell">売上</th>
							<th className="remove-cell">削除</th>
						</tr>
					</thead>

					<tbody>
						{members.map(a =>
							<MemberEditor
								key={a.key}
								member={a}
								members={members}
								updatedColors={updatedColors}
								callbackRemoveMember={handleRemoveMember}
							/>
						)}
					</tbody>

					<tfoot>
						<tr>
							<td className="name-cell">
								<input
									name='member-name'
									value={newMemberName}
									onChange={ev => setNewMemberName(ev.target.value)}
								/>
							</td>
							<td className="add-cell">
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
				{visibleDialog && (
					<GroupColorsDialog
						choiceColorGroup={props.group}
						callbackClosed={a => {
							if(a) {
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

function sortMemberCore(a: Readonly<MemberSetting>, b: Readonly<MemberSetting>): number {
	return a.name.localeCompare(b.name);
}

function sortMembers(member: Array<Readonly<MemberSetting>>): Array<MemberSetting> {
	return member.sort((a, b) => sortMemberCore(a, b));
}