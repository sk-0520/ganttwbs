import classNames from "classnames";
import { FC } from "react";

import DynamicLabel from "@/components/elements/DynamicLabel";
import Timestamp from "@/components/elements/Timestamp";
import { Locale, useLocale } from "@/locales/locale";
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

const WorkRangeCells: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const selectOrClickClassName = props.selectable ? "selectable" : "clickable";

	return props.workRangeKind === WorkRangeKind.Success
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
					{toDisplayWorkRangeKind(locale, props.workRangeKind)}
				</DynamicLabel>
			</td>
		);
};

export default WorkRangeCells;

function toDisplayWorkRangeKind(locale: Locale, kind: WorkRangeKind): string {
	switch (kind) {
		case WorkRangeKind.Loading:
			return locale.editor.timeline.workRange.kind.loading;

		case WorkRangeKind.NoInput:
			return locale.editor.timeline.workRange.kind.noInput;

		case WorkRangeKind.SelfSelectedError:
			return locale.editor.timeline.workRange.kind.selfSelectedError;

		case WorkRangeKind.NoChildren:
			return locale.editor.timeline.workRange.kind.noChildren;

		case WorkRangeKind.RelationNoInput:
			return locale.editor.timeline.workRange.kind.relationNoInput;

		case WorkRangeKind.RelationError:
			return locale.editor.timeline.workRange.kind.relationError;

		case WorkRangeKind.RecursiveError:
			return locale.editor.timeline.workRange.kind.recursiveError;

		case WorkRangeKind.UnknownError:
			return locale.editor.timeline.workRange.kind.unknownError;

		case WorkRangeKind.Success:
		default:
			throw new Error("WorkRangeKind: " + kind.toString());
	}

}
