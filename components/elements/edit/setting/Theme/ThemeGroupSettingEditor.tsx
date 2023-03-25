import { NextPage } from "next";
import { useContext, useState } from "react";
import { v4 } from "uuid";

import { SettingContext, UUID } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [groups, setGroups] = useState(settingContext.theme.groups);

	function handleChangeColor(key: UUID, color: Color) {
		const target = groups.find(a => a.key === key);
		if (!target) {
			throw new Error();
		}
		target.value = color;
	}

	function handleRemoveColor(key: UUID) {
		const items = groups.filter(a => a.key !== key);
		setGroups(settingContext.theme.groups = items);
	}

	function handleAddColor() {
		groups.push({
			key: v4(),
			value: "#4444ff",
		});
		setGroups(settingContext.theme.groups = [...groups]);
	}

	return (
		<>
			<ol>
				{groups.map((a) => {
					return (
						<li key={a.key}>
							<input
								type='color'
								defaultValue={a.value}
								onChange={ev => handleChangeColor(a.key, ev.target.value)}
							/>
							<button type='button' onClick={ev => handleRemoveColor(a.key)}>remove</button>
						</li>
					);
				})}
			</ol>
			<button type='button' onClick={handleAddColor}>追加</button>
		</>
	);
};

export default Component;
