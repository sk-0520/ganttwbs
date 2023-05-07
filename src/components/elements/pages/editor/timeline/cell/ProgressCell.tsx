
import { FC, useState } from "react";

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
	const [progress, setProgress] = useState(props.progress);

	if (props.readOnly) {
		return (
			<td className="timeline-cell timeline-progress readonly">
				{Timelines.displayProgress(progress)}%
			</td>
		);
	}

	const progressSet = new Set<Progress>(defaultProgressItems);
	progressSet.add(progress);
	const progressItems = [...progressSet].sort();

	function handleChangeProgress(value: string) {
		const progress = As.float(value);
		setProgress(progress);
		if (props.callbackChangeValue) {
			props.callbackChangeValue(progress);
		}
	}

	return (
		<td className="timeline-cell timeline-progress">
			<select
				className="edit"
				disabled={props.disabled}
				value={progress}
				onChange={ev => handleChangeProgress(ev.target.value)}
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
