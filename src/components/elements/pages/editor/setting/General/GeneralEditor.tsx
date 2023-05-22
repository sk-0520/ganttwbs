import { FC, useContext, useState } from "react";

import { IconKind, IconLabel } from "@/components/elements/Icon";
import DefaultButton from "@/components/elements/pages/editor/setting/DefaultButton";
import { useLocale } from "@/locales/locale";
import { SettingContext } from "@/models/context/SettingContext";
import { DefaultSettings } from "@/models/DefaultSettings";
import { Strings } from "@/models/Strings";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";

const timeZoneOffsets = [
	TimeSpan.fromHours(+1),
	TimeSpan.fromHours(+2),
	TimeSpan.fromHours(+3),
	TimeSpan.fromHours(+3.5),
	TimeSpan.fromHours(+4),
	TimeSpan.fromHours(+4.5),
	TimeSpan.fromHours(+5),
	TimeSpan.fromHours(+5.5),
	TimeSpan.fromHours(+5.75),
	TimeSpan.fromHours(+6),
	TimeSpan.fromHours(+6.5),
	TimeSpan.fromHours(+7),
	TimeSpan.fromHours(+8),
	TimeSpan.fromHours(+8.75),
	TimeSpan.fromHours(+9),
	TimeSpan.fromHours(+9.5),
	TimeSpan.fromHours(+10),
	TimeSpan.fromHours(+10.5),
	TimeSpan.fromHours(+11),
	TimeSpan.fromHours(+11.5),
	TimeSpan.fromHours(+12),
	TimeSpan.fromHours(+12.75),
	TimeSpan.fromHours(+13),
	TimeSpan.fromHours(+14),
	TimeSpan.fromHours(-1),
	TimeSpan.fromHours(-2),
	TimeSpan.fromHours(-3),
	TimeSpan.fromHours(-3.5),
	TimeSpan.fromHours(-4),
	TimeSpan.fromHours(-4.5),
	TimeSpan.fromHours(-5),
	TimeSpan.fromHours(-6),
	TimeSpan.fromHours(-7),
	TimeSpan.fromHours(-8),
	TimeSpan.fromHours(-9),
	TimeSpan.fromHours(-9.5),
	TimeSpan.fromHours(-10),
	TimeSpan.fromHours(-11),
	TimeSpan.fromHours(-12),
] as const;

const GeneralEditor: FC = () => {
	const locale = useLocale();
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
			<dt>
				{locale.pages.editor.setting.general.projectName}
			</dt>
			<dd>
				<input
					type="text"
					required
					defaultValue={settingContext.general.name}
					onChange={ev => settingContext.general.name = ev.target.value}
				/>
			</dd>

			<dt>
				{locale.pages.editor.setting.general.recursive}
			</dt>
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

			<dt>
				{locale.common.calendar.timeZone}
			</dt>
			<dd>
				<select
					value={timeZone}
					onChange={ev => handleChangeTimeZone(TimeZone.parse(ev.target.value))}
				>
					<optgroup
						label={locale.pages.editor.setting.general.timeZoneKind.name}
					>
						{TimeZone.getTimeZones().map(a => {
							return (
								<option
									key={a.serialize()}
									value={a.serialize()}
								>
									{a.serialize()}
								</option>
							);
						})}
					</optgroup>
					<optgroup
						label={locale.pages.editor.setting.general.timeZoneKind.offset}
					>
						{timeZoneOffsets.map(a => {
							const timeZone = TimeZone.create(a);

							return (
								<option
									key={timeZone.serialize()}
									value={timeZone.serialize()}
								>
									{timeZone.serialize()}
								</option>
							);
						})}
					</optgroup>
				</select>
				<button
					type="button"
					onClick={_ => handleChangeTimeZone(currentTimeZone)}
				>
					<IconLabel
						kind={IconKind.Reset}
						label={Strings.replaceMap(
							locale.pages.editor.setting.general.selectCurrentTimeZoneFormat,
							{
								"TIMEZONE": TimeZone.getClientTimeZone().serialize(),
							}
						)}
					/>
				</button>
			</dd>

		</dl>
	);
};

export default GeneralEditor;

