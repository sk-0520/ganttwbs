
import { FC } from "react";

import { As } from "@/models/As";
import { Progress } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";

const defaultProgressItems = [
	0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
] as const;

interface Props {
	readOnly: boolean;
	disabled: boolean;
	progress: Progress;
	callbackChangeValue?: (value: Progress) => void;
}

const ProgressCell: FC<Props> = (props: Props) => {
	if(props.readOnly) {
		return (
			<td className="timeline-cell timeline-progress readonly">
				{Timelines.displayProgress(props.progress)}%
			</td>
		);
	}

	const progressSet = new Set<Progress>(defaultProgressItems);
	progressSet.add(props.progress);
	const progressItems = [...progressSet].sort();

	return (
		<td className="timeline-cell timeline-progress">
			<select
				className="edit"
				disabled={props.disabled}
				defaultValue={props.progress}
				onChange={ev => props.callbackChangeValue ? props.callbackChangeValue(As.float(ev.target.value)) : undefined}
			>
				{progressItems.map(a => {
					return (
						<option
							key={a}
							value={a}
						>
							{Timelines.displayProgress(a)}
						</option>
					);
				})}
			</select>
		</td>
	);
};

export default ProgressCell;
