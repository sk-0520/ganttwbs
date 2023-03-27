import Timelines from "@/models/Timelines";
import { NextPage } from "next";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: number;
	callbackChangeValue?: (value: number) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div className='timeline-workload'>
			<input
				type="number"
				disabled={props.disabled}
				step="0.25"
				min={0}
				value={Timelines.displayWorkload(props.value)}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(ev.target.valueAsNumber) : undefined}
			/>
		</div>
	);
}

export default Component;
