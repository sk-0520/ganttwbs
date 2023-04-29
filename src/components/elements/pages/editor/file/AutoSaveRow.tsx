import { Locale, useLocale } from "@/locales/locale";
import { DateTime } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";
import { Types } from "@/models/Types";
import { AutoSaveKind } from "@/models/data/AutoSave";
import { FC, ReactNode } from "react";

interface Props {
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
	const localeKind = props.kind === AutoSaveKind.Storage ? "ストレージ" : "ダウンロード";
	const step = props.kind === AutoSaveKind.Storage ? 0.5 : 1;

	return (
		<tr>
			<td className="kind-cell">
				{localeKind}
			</td>
			<td className="enabled-cell">
				<label>
					<input
						type='checkbox'
						checked={props.isEnabled}
						onChange={ev => props.callbackChangeAutoSaveIsEnable(props.kind, ev.target.checked)}
					/>
					有効
				</label>
			</td>
			<td className="span-cell">
				<input
					className="span"
					type='number'
					min={0}
					step={step}
					value={toAutoSaveTimeValue(props.time)}
					onChange={ev => props.callbackChangeAutoSaveTime(props.kind, fromAutoSaveTimeValue(ev.target.valueAsNumber))}
				/>
			</td>
			<td className="last-time-cell">
				{renderDateTime(props.lastTime, locale)}
			</td>
			<td className="next-time-cell">
				{renderDateTime(props.nextTime, locale)}
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

function renderDateTime(time: DateTime | undefined, locale: Locale): ReactNode {
	if (time) {
		return (
			<time className="time" dateTime={time.format("U")}>
				{time.format("HH:mm:ss")}
			</time>
		);
	}

	return (
		<span className="time">--:--:--</span>
	);
}
