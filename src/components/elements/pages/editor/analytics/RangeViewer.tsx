import Timestamp from "@/components/elements/Timestamp";
import { TotalSuccessWorkRange } from "@/models/data/WorkRange";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { FC } from "react";

interface Props extends CalendarInfoProps {
	totalSuccessWorkRange: TotalSuccessWorkRange
}

const RangeViewer: FC<Props> = (props: Props) => {
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
							<Timestamp format="date" date={props.calendarInfo.range.begin} />
						</td>
						<td>
							<Timestamp format="date" date={props.calendarInfo.range.end} />
						</td>
					</tr>
					<tr>
						<td>
							実働
						</td>
						<td>
							<Timestamp format="date" date={props.totalSuccessWorkRange.minimum.begin} />
						</td>
						<td>
							<Timestamp format="date" date={props.totalSuccessWorkRange.maximum.end} />
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
};

export default RangeViewer;
