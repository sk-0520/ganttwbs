import { Timelines } from "@/models/Timelines";
import { NextPage } from "next";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: number;
	callbackChangeValue?: (value: number) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div className="timeline-progress">
			<input
				className="edit"
				type="number"
				readOnly={props.readOnly}
				disabled={props.disabled}
				min={0}
				max={100}
				step={1}
				value={Timelines.displayProgress(props.value)}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(ev.target.valueAsNumber) : undefined}
			/>
		</div>
	)
}

export default Component;
