import { FC, Fragment, ReactNode, useState } from "react";

import { Calendars } from "@/models/Calendars";
import { useCalendarInfoAtomReader, useResourceInfoAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { AnyTimeline, Member, TaskTimeline } from "@/models/data/Setting";
import { SuccessWorkRange, TotalSuccessWorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";

type DisplayValue = "workload" | "cost";

interface Props {
	totalSuccessWorkRange: TotalSuccessWorkRange | undefined;
	successWorkRanges: ReadonlyArray<SuccessWorkRange>;
	sequenceTimelines: ReadonlyArray<AnyTimeline>;
}

const WorkViewer: FC<Props> = (props: Props) => {
	const resourceInfoAtomReader = useResourceInfoAtomReader();

	const [displayValue, /*setDisplayValue*/] = useState<DisplayValue>("workload");
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const months = props.totalSuccessWorkRange
		? Calendars.getMonths(props.totalSuccessWorkRange.minimum.begin, props.totalSuccessWorkRange.maximum.end)
		: []
		;
	const taskTimelines = props.sequenceTimelines.filter(Settings.maybeTaskTimeline);

	return (
		<section>
			<h2>
				稼働
			</h2>

			<table>
				<thead>
					<tr>
						<th>
							グループ
						</th>
						<th>
							要員
						</th>
						{renderMonths(months)}
					</tr>
				</thead>
				<tbody>
					{resourceInfoAtomReader.data.groupItems.map(a => {
						if (!a.members.length) {
							return <></>;
						}

						const members = [...Require.get(resourceInfoAtomReader.data.memberItems, a)];
						const firstMember = members[0];
						const nextMembers = members;
						nextMembers.shift();

						return (
							<Fragment key={a.id}>
								<tr>
									<td
										rowSpan={nextMembers.length + 1}
									>
										{a.name}
									</td>
									{renderMember(displayValue, firstMember, months, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges)}
								</tr>
								{nextMembers.map(b => {
									return (
										<tr key={b.id}>
											{renderMember(displayValue, b, months, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges)}
										</tr>
									);
								})}
							</Fragment>
						);
					})}
				</tbody>
			</table>

		</section>
	);
};

export default WorkViewer;

function renderMonths(months: ReadonlyArray<DateTime>): ReactNode {
	return months.map(a => {
		return (
			<th key={a.ticks}>
				<time dateTime={a.format("U")}>
					{a.month}
				</time>
			</th>
		);
	});
}

function renderMember(displayValue: DisplayValue, member: Member, months: ReadonlyArray<DateTime>, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>): ReactNode {
	return (
		<Fragment key={member.id}>
			<td>
				{member.name}
			</td>

			{months.map(a => {
				const range = {
					begin: a,
					end: a.getLastDayOfMonth().add(23, "hour").add(59, "minute"), //TODO ミリ秒追加がないんだわ
				};

				const percent = calcDisplayValue(member, range.begin, range.end, calendarInfo, taskTimelines, successWorkRanges);

				return (
					<td key={a.ticks}>
						{percent}
					</td>
				);
			})}
		</Fragment>
	);
}


function calcDisplayValue(member: Member, begin: DateTime, end: DateTime, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>): number {

	// わからん。適当
	const days = Calendars.getDays(begin, end);

	const timelines = taskTimelines.filter(a => a.memberId === member.id);
	const workRanges = successWorkRanges
		.filter(a => timelines.some(b => b.id === a.timeline.id))
		.filter(a => begin.ticks <= a.begin.ticks)
		;

	return workRanges.length / days.length;

	// switch (displayValue) {
	// 	case "workload":
	// 		return calcDisplayValueWorkload(member, begin, end, calendarInfo, taskTimelines, totalSuccessWorkRange);

	// 	case "cost":
	// 		return calcDisplayValueCost(member, begin, end, calendarInfo, taskTimelines, totalSuccessWorkRange);

	// 	default:
	// 		throw new Error();
	// }
}
