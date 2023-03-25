import { NextPage } from "next";
import { useContext, useState } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import { Color } from "@/models/data/Setting";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const [completed, setCompleted] = useState(settingContext.theme.completed);

	function handleChangeColor(color: Color) {
		setCompleted(color);
		settingContext.theme.completed = color;
	}

	return (
		<input
			type='color'
			defaultValue={completed}
			onChange={ev => handleChangeColor(ev.target.value)} />
	);
};

export default Component;
