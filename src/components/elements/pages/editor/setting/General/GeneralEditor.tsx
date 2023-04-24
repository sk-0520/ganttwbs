import { FC, useContext, useState } from "react";

import { IconImage, IconKind } from "@/components/elements/Icon";
import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import { SettingContext } from "@/models/data/context/SettingContext";
import { DefaultSettings } from "@/models/DefaultSettings";
import { TimeZone } from "@/models/TimeZone";


const GeneralEditor: FC = () => {
	const settingContext = useContext(SettingContext);

	const [recursive, setRecursive] = useState(settingContext.general.recursive);
	const [timeZone, setTimeZone] = useState(settingContext.general.timeZone.serialize());

	function handleChangeRecursive(value: number): void {
		setRecursive(value);
		settingContext.general.recursive = value;
	}

	function handleChangeTimeZone(tz: TimeZone): void {
		setTimeZone(tz.serialize());
		settingContext.general.timeZone = tz;
	}

	const currentTimeZone = TimeZone.getClientTimeZone();

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
					readOnly
					value={timeZone}
				/>
				<button
					type="button"
					onClick={_ => handleChangeTimeZone(currentTimeZone)}
				>
					<IconImage
						kind={IconKind.Reset}
					/>
					現在タイムゾーン
					({TimeZone.getClientTimeZone().serialize()})
				</button>
				<ul className="timezone-selector">
					{TimeZone.getTimeZones().map(a => {
						return (
							<li key={a.serialize()}>
								<button
									type="button"
									onClick={_ => handleChangeTimeZone(a)}
									className={currentTimeZone.serialize() === a.serialize() ? "current" : ""}
								>
									{a.serialize()}
								</button>
							</li>
						);
					})}
				</ul>
			</dd>

		</dl>
	);
};

export default GeneralEditor;

