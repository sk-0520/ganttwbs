import { FC } from "react";

import Timestamp from "@/components/elements/Timestamp";
import { useLocale } from "@/locales/locale";
import { useCalendarInfoAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { TotalSuccessWorkRange } from "@/models/data/WorkRange";

interface Props {
	totalSuccessWorkRange: TotalSuccessWorkRange | undefined;
}

const RangeViewer: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	return (
		<section className="range">
			<h2>
				{locale.pages.editor.analytics.range.title}
			</h2>

			<table>
				<thead>
					<tr>
						<th />
						<th>
							{locale.pages.editor.analytics.range.begin}
						</th>
						<th>
							{locale.pages.editor.analytics.range.end}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							{locale.pages.editor.analytics.range.schedule}
						</td>
						<td>
							<Timestamp format="date" date={calendarInfoAtomReader.data.range.begin} />
						</td>
						<td>
							<Timestamp format="date" date={calendarInfoAtomReader.data.range.end} />
						</td>
					</tr>
					<tr>
						<td>
							{locale.pages.editor.analytics.range.actual}
						</td>
						<td>
							{props.totalSuccessWorkRange
								? (
									<Timestamp format="date" date={props.totalSuccessWorkRange.minimum.begin} />
								)
								: (
									<span>
										{locale.common.error.calc}
									</span>
								)
							}
						</td>
						<td>
							{props.totalSuccessWorkRange
								? (
									<Timestamp format="date" date={props.totalSuccessWorkRange.maximum.end} />
								)
								: (
									<span>
										{locale.common.error.calc}
									</span>
								)
							}
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
};

export default RangeViewer;
