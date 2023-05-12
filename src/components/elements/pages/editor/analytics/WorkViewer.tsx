import { FC, Fragment, ReactNode, useState } from "react";

import { Calendars } from "@/models/Calendars";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { AnyTimeline, Member, TaskTimeline } from "@/models/data/Setting";
import { TotalSuccessWorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";

type DisplayValue = "workload" | "cost";

interface Props extends CalendarInfoProps, ResourceInfoProps {
	totalSuccessWorkRange: TotalSuccessWorkRange;
	sequenceTimelines: Array<AnyTimeline>;
}

const WorkViewer: FC<Props> = (props: Props) => {

	const [displayValue, /*setDisplayValue*/] = useState<DisplayValue>("workload");

	const months = Calendars.getMonths(props.totalSuccessWorkRange.minimum.begin, props.totalSuccessWorkRange.maximum.end);
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
					{props.resourceInfo.groupItems.map(a => {
						if (!a.members.length) {
							return <></>;
						}

						const members = [...Require.get(props.resourceInfo.memberItems, a)];
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
									{renderMember(displayValue, firstMember, months, props.calendarInfo, taskTimelines)}
								</tr>
								{nextMembers.map(b => {
									return (
										<tr key={b.id}>
											{renderMember(displayValue, b, months, props.calendarInfo, taskTimelines)}
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

function renderMember(displayValue: DisplayValue, member: Member, months: ReadonlyArray<DateTime>, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>): ReactNode {
	return (
		<Fragment key={member.id}>
			<td>
				{member.name}
			</td>
			{months.map(a => {
				return (
					<td key={a.ticks}>
						TODO:当月内の稼働率とか
					</td>
				);
			})}
		</Fragment>
	);
}
