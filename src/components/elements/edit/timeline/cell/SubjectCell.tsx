import { NextPage } from "next";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: string;
	callbackChangeValue: (value: string) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div className='timeline-cell timeline-subject'>
			<input
				className="edit"
				type='text'
				value={props.value}
				readOnly={props.readOnly}
				disabled={props.disabled}
				onChange={ev => props.callbackChangeValue(ev.target.value)}
			/>
		</div>
	)
}

export default Component;
