
import { FC, KeyboardEvent } from "react";

import { AnyTimeline } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";

interface Props {
	timeline: AnyTimeline;
	readOnly: boolean;
	disabled: boolean;
	value: number;
	callbackChangeValue?: (value: number) => void;
	callbackFocus(isFocus: boolean): void;
	callbackKeyDown(ev: KeyboardEvent<HTMLInputElement>): void;
}

const WorkloadCell: FC<Props> = (props: Props) => {

	if (props.readOnly) {
		return (
			<td className="timeline-cell timeline-workload readonly">
				{Timelines.displayWorkload(props.value)}
			</td>
		);
	}

	return (
		<td className="timeline-cell timeline-workload">
			<input
				id={Timelines.toWorkloadId(props.timeline)}
				className="edit"
				type="number"
				disabled={props.disabled}
				step="0.25"
				min={0}
				value={Timelines.displayWorkload(props.value)}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(ev.target.valueAsNumber) : undefined}
				onFocus={ev => props.callbackFocus(true)}
				onBlur={ev => props.callbackFocus(false)}
				onKeyDown={props.callbackKeyDown}
			/>
		</td>
	);
};

export default WorkloadCell;
