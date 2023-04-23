import classNames from "classnames";
import { NextPage } from "next";

import DynamicLabel from "@/components/elements/DynamicLabel";
import Timestamp from "@/components/elements/Timestamp";
import { WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";

interface Props {
	workRangeKind: WorkRangeKind;
	selectable: boolean;
	beginDate: DateTime | null;
	endDate: DateTime | null;
	htmlFor: string;
	callbackClickBeginDate?(): void;
}

const WorkRangeCells: NextPage<Props> = (props: Props) => {

	const selectOrClickClassName = props.selectable ? "selectable" : "clickable";

	return props.workRangeKind === "success"
		? (
			<>
				<td
					className={
						classNames(
							"timeline-cell timeline-range-from",
							selectOrClickClassName
						)
					}
					onClick={props.callbackClickBeginDate}
				>
					<DynamicLabel htmlFor={props.htmlFor} wrap={props.selectable}>
						<Timestamp format="date" date={props.beginDate} />
					</DynamicLabel>
				</td>
				<td
					className={
						classNames(
							"timeline-cell timeline-range-to",
							selectOrClickClassName
						)
					}
					onClick={props.callbackClickBeginDate}
				>
					<DynamicLabel htmlFor={props.htmlFor} wrap={props.selectable}>
						<Timestamp format="date" date={props.endDate} />
					</DynamicLabel>
				</td>
			</>
		) : (
			<td
				className={
					classNames(
						"timeline-cell timeline-range-area",
						selectOrClickClassName
					)
				}
				colSpan={2}
				onClick={props.callbackClickBeginDate}
			>
				<DynamicLabel htmlFor={props.htmlFor} wrap={props.selectable}>
					{props.workRangeKind}
				</DynamicLabel>
			</td>
		);
};

export default WorkRangeCells;
