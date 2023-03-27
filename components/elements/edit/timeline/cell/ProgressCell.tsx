import Timelines from "@/models/Timelines";
import { NextPage } from "next";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	progress: number;
	callbackOnChange?: (value: number) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div className="timeline-progress">
			<input
				type="number"
				readOnly={props.readOnly}
				disabled={props.disabled}
				min={0}
				max={100}
				step={1}
				value={Timelines.displayProgress(props.progress)}
				onChange={ev => props.callbackOnChange ? props.callbackOnChange(ev.target.valueAsNumber) : undefined}
			/>
		</div>
	)
}

export default Component;
