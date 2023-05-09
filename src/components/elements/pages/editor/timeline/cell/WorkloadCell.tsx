
import { FC } from "react";

import { Timelines } from "@/models/Timelines";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: number;
	callbackChangeValue?: (value: number) => void;
	callbackFocus(isFocus: boolean): void;
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
				className="edit"
				type="number"
				disabled={props.disabled}
				step="0.25"
				min={0}
				value={Timelines.displayWorkload(props.value)}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(ev.target.valueAsNumber) : undefined}
				onFocus={ev => props.callbackFocus(true)}
				onBlur={ev => props.callbackFocus(false)}
			/>
		</td>
	);
};

export default WorkloadCell;
