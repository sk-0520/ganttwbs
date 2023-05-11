import { Timelines } from "@/models/Timelines";
import { AnyTimeline } from "@/models/data/Setting";
import { FC, KeyboardEvent } from "react";

interface Props {
	timeline: AnyTimeline;
	readOnly: boolean;
	disabled: boolean;
	value: string;
	callbackChangeValue: (value: string) => void;
	callbackFocus(isFocus: boolean): void;
	callbackKeyDown(ev: KeyboardEvent<HTMLInputElement>): void;
}

const SubjectCell: FC<Props> = (props: Props) => {
	return (
		<td className="timeline-cell timeline-subject">
			<input
				id={Timelines.toSubjectId(props.timeline)}
				className="edit"
				type="text"
				value={props.value}
				readOnly={props.readOnly}
				disabled={props.disabled}
				onChange={ev => props.callbackChangeValue(ev.target.value)}
				onFocus={ev => props.callbackFocus(true)}
				onBlur={ev => props.callbackFocus(false)}
				onKeyDown={props.callbackKeyDown}
			/>
		</td>
	);
};

export default SubjectCell;
