import { FC, ReactNode } from "react";

import Timestamp from "@/components/elements/Timestamp";
import { useLocale } from "@/locales/locale";
import { AutoSaveKind } from "@/models/data/AutoSave";
import { Configuration } from "@/models/data/Configuration";
import { DateTime, InvalidHtmlTime } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";
import { Types } from "@/models/Types";

interface Props {
	configuration: Configuration;
	kind: AutoSaveKind;
	isEnabled: boolean;
	time: TimeSpan;

	lastTime: DateTime | undefined;
	nextTime: DateTime | undefined;

	callbackChangeAutoSaveIsEnable(kind: AutoSaveKind, isEnabled: boolean): void;
	callbackChangeAutoSaveTime(kind: AutoSaveKind, time: TimeSpan | undefined): void
}

const AutoSaveRow: FC<Props> = (props: Props) => {
	const locale = useLocale();

	type KindValues = {
		kind: string;
		step: number;
	};
	const kindValues: KindValues = props.kind === AutoSaveKind.Storage
		? {
			kind: locale.pages.editor.file.save.auto.storage.kind,
			step: props.configuration.autoSave.storage.step,
		}
		: {
			kind: locale.pages.editor.file.save.auto.download.kind,
			step: props.configuration.autoSave.download.step,
		}
		;

	return (
		<tr>
			<td className="kind-cell">
				{kindValues.kind}
			</td>
			<td className="enabled-cell">
				<label>
					<input
						type="checkbox"
						checked={props.isEnabled}
						onChange={ev => props.callbackChangeAutoSaveIsEnable(props.kind, ev.target.checked)}
					/>
					{locale.common.enabled}
				</label>
			</td>
			<td className="span-cell">
				<input
					className="span"
					type="number"
					min={0}
					step={kindValues.step}
					value={toAutoSaveTimeValue(props.time)}
					onChange={ev => props.callbackChangeAutoSaveTime(props.kind, fromAutoSaveTimeValue(ev.target.valueAsNumber))}
				/>
			</td>
			<td className="last-time-cell">
				{renderDateTime(props.lastTime)}
			</td>
			<td className="next-time-cell">
				{renderDateTime(props.nextTime)}
			</td>
		</tr>
	);
};

export default AutoSaveRow;

function toAutoSaveTimeValue(time: TimeSpan) {
	return time.totalMinutes;
}

function fromAutoSaveTimeValue(value: number | undefined): TimeSpan | undefined {
	if (Types.isUndefined(value)) {
		return undefined;
	}

	return TimeSpan.fromMinutes(value);
}

function renderDateTime(time: DateTime | undefined): ReactNode {
	if (time) {
		return (
			<Timestamp
				format="time"
				date={time}
			/>
		);
	}

	return (
		<time dateTime={InvalidHtmlTime}>--:--:--</time>
	);
}
