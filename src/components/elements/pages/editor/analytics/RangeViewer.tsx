import { FC } from "react";

import Timestamp from "@/components/elements/Timestamp";
import { useCalendarInfoAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { TotalSuccessWorkRange } from "@/models/data/WorkRange";

interface Props {
	totalSuccessWorkRange: TotalSuccessWorkRange | undefined;
}

const RangeViewer: FC<Props> = (props: Props) => {
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	return (
		<section>
			<h2>
				期間
			</h2>
			<table>
				<thead>
					<tr>
						<th>*</th>
						<th>
							開始
						</th>
						<th>
							終了
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							予定
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
							実働
						</td>
						<td>
							{props.totalSuccessWorkRange
								? (
									<Timestamp format="date" date={props.totalSuccessWorkRange.minimum.begin} />
								)
								: (
									<span>
										計算結果エラー
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
										計算結果エラー
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
