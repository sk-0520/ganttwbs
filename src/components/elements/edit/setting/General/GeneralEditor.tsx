import { SettingContext } from "@/models/data/context/SettingContext";
import { NextPage } from "next";
import { useContext } from "react";


const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	return (
		<dl className="inputs">
			<dt>タイトル</dt>
			<dd>
				<input
					type="text"
					required
					defaultValue={settingContext.general.name}
					onChange={ev => settingContext.general.name = ev.target.value}
				/>
			</dd>

			<dt>反復計算数</dt>
			<dd>
				<input
					type="number"
					required
					min={1}
					max={999999}
					defaultValue={settingContext.general.recursive}
					onChange={ev => settingContext.general.recursive = ev.target.valueAsNumber}
				/>
			</dd>

		</dl>
	);
};

export default Component;

