import { FC } from "react";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: string;
	callbackChangeValue: (value: string) => void;
}

const SubjectCell: FC<Props> = (props: Props) => {
	return (
		<td className='timeline-cell timeline-subject'>
			<input
				className="edit"
				type='text'
				value={props.value}
				readOnly={props.readOnly}
				disabled={props.disabled}
				onChange={ev => props.callbackChangeValue(ev.target.value)}
			/>
		</td>
	);
};

export default SubjectCell;
