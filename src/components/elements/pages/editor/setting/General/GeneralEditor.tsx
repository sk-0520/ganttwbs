import { FC, useContext, useState } from "react";

import { SettingContext } from "@/models/data/context/SettingContext";
import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import { DefaultSettings } from "@/models/DefaultSettings";


const GeneralEditor: FC = () => {
	const settingContext = useContext(SettingContext);

	const [recursive, setRecursive] = useState(settingContext.general.recursive);

	function handleChangeRecursive(value: number): void {
		setRecursive(value);
		settingContext.general.recursive = value;
	}

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
					value={recursive}
					onChange={ev => handleChangeRecursive(ev.target.valueAsNumber)}
				/>
				<DefaultButton callbackClick={() => setRecursive(DefaultSettings.RecursiveMaxCount)} />
			</dd>

			<dt>タイムゾーン</dt>
			<dd>
				<input
					type="text"
					required
					defaultValue={settingContext.general.timeZone}
					onChange={ev => settingContext.general.timeZone = ev.target.value}
					/>
			</dd>

		</dl>
	);
};

export default GeneralEditor;

