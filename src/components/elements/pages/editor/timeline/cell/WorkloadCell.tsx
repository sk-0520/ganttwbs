import { NextPage } from "next";

import { Timelines } from "@/models/Timelines";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: number;
	callbackChangeValue?: (value: number) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<td className='timeline-cell timeline-workload'>
			<input
				className="edit"
				type="number"
				disabled={props.disabled}
				readOnly={props.readOnly}
				step="0.25"
				min={0}
				value={Timelines.displayWorkload(props.value)}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(ev.target.valueAsNumber) : undefined}
			/>
		</td>
	);
};

export default Component;
