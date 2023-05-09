import { FC } from "react";

interface Props {
	readOnly: boolean;
	disabled: boolean;
	value: string;
	callbackChangeValue: (value: string) => void;
	callbackFocus(isFocus: boolean): void;
}

const SubjectCell: FC<Props> = (props: Props) => {
	return (
		<td className="timeline-cell timeline-subject">
			<input
				className="edit"
				type="text"
				value={props.value}
				readOnly={props.readOnly}
				disabled={props.disabled}
				onChange={ev => props.callbackChangeValue(ev.target.value)}
				onFocus={ev => props.callbackFocus(true)}
				onBlur={ev => props.callbackFocus(false)}
			/>
		</td>
	);
};

export default SubjectCell;
