import { NextPage } from "next";

import { Progress } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	progress: Progress;
	callbackChangeValue?: (value: number) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div className="timeline-cell timeline-progress">
			<input
				className="edit"
				type="number"
				readOnly={props.readOnly}
				disabled={props.disabled}
				min={0}
				max={100}
				step={1}
				value={Timelines.displayProgress(props.progress)}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(ev.target.valueAsNumber) : undefined}
			/>
		</div>
	)
}

export default Component;
