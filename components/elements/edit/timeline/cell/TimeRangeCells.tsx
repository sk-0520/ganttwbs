import DynamicLabel from "@/components/elements/DynamicLabel";
import Timestamp from "@/components/elements/Timestamp";
import { TimeRangeKind } from "@/models/TimeRange";
import { NextPage } from "next";

interface Props {
	timeRangeKind: TimeRangeKind;
	selectable: boolean;
	beginDate: Date | null;
	endDate: Date | null;
	htmlFor?: string;
	callbackClickBeginDate?(): void;
}

const Component: NextPage<Props> = (props: Props) => {

	const selectOrClickClassName = props.selectable ? 'selectable' : 'clickable'

	return props.timeRangeKind === "success"
		? (
			<>
				<div
					className={
						'timeline-range-from'
						+ ' ' + selectOrClickClassName
					}
					onClick={props.callbackClickBeginDate}
				>
					<DynamicLabel htmlFor={props.htmlFor} wrap={props.selectable}>
						<Timestamp format="date" date={props.beginDate} />
					</DynamicLabel>
				</div>
				<div
					className={
						'timeline-range-to'
						+ ' ' + selectOrClickClassName
					}
					onClick={props.callbackClickBeginDate}
				>
					<DynamicLabel htmlFor={props.htmlFor} wrap={props.selectable}>
						<Timestamp format="date" date={props.endDate} />
					</DynamicLabel>
				</div>
			</>
		) : (
			<div
				className={
					"timeline-range-area"
					+ ' ' + selectOrClickClassName
				}
				onClick={props.callbackClickBeginDate}
			>
				<DynamicLabel htmlFor={props.htmlFor} wrap={props.selectable}>
					{props.timeRangeKind}
				</DynamicLabel>
			</div>
		)
}

export default Component;
