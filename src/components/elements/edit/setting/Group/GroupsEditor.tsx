import { NextPage } from "next";
import { useContext, MouseEvent, useState, ReactNode } from "react";
import { v4 } from "uuid";

import { GroupSetting, MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import MemberEditor from "./MemberEditor";
import Dialog from "@/components/elements/Dialog";
import { Color, MemberId } from "@/models/data/Setting";
import { TinyColor } from "@ctrl/tinycolor";

type ColorKind = "abc" | "def" | "ghi" | "jkl";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [newGroupName, setNewGroupName] = useState("");
	const [editGroups, setEditGroups] = useState(settingContext.groups);
	const [choiceColorGroup, setChoiceColorGroup] = useState<GroupSetting | null>(null);
	const [choiceColors, setChoiceColors] = useState<Map<MemberId, TinyColor>>(new Map());
	const [choiceBaseColor, setChoiceBaseColor] = useState<Color>("#ff0000");

	const colorKinds: ReadonlyArray<ColorKind> = [
		"abc",
		"def",
		"ghi",
		"jkl",
	]

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
			key: v4(),
			name: groupName,
			members: [],
		};
		setEditGroups(settingContext.groups = [...editGroups, newGroup]);
		setNewGroupName("");
	}

	function handleStartChoiceColor(group: GroupSetting): void {
		setChoiceColors(new Map(
			group.members.map(a => [a.id, new TinyColor(a.color)])
		));
		setChoiceColorGroup(group);
	}

	function handleSelectColorKind(colorKind: ColorKind, group: GroupSetting): void {
		switch (colorKind) {
			case "abc":
				break;

			case "def":
				break;

			case "ghi":
				break;

			case "jkl":
				break;

			default:
				throw new Error();
		}
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

	return (
		<>
			<dl className="inputs">
				{editGroups.map(a => {
					let memberName = "";

					const handleRemoveMember = (member: MemberSetting) => {
						removeMember(a, member);
					};

					return (
						<>
							<dt key={"group-" + a.key} className="group">
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

							<dd key={"member-" + a.key} className="member">
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
												callbackRemoveMember={handleRemoveMember}
											/>
										)}
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

			{choiceColorGroup && (
				<Dialog
					button="submit"
					title="色選択"
					callbackClose={(type) => {
						console.log(type);
						setChoiceColorGroup(null);
					}}
				>
					<>
						<label>
							基準色
							<input
								type="color"
								value={choiceBaseColor}
								onChange={ev => setChoiceBaseColor(ev.target.value)}
							/>
						</label>

						<ul className="inline">
							{colorKinds.map(a => {
								return (
									<li key={a}>
										<label>
											<button
												type="button"
												onClick={ev => handleSelectColorKind(a, choiceColorGroup)}
											>
												{a}
											</button>
										</label>
									</li>
								);
							})}
						</ul>
						<ul>
							{
								[...choiceColors.entries()].map(([k, v]) => {
									const member = choiceColorGroup.members.find(a => a.id === k);
									if (!member) {
										console.warn("MEMBER", k)
										return <></>;
									}

									return (
										<li key={member.key}>
											{member.name}
											{v.toHexString()}
										</li>
									);
								})
							}
						</ul>
					</>
				</Dialog>
			)}
		</>
	);
};

export default Component;

