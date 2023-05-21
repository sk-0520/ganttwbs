import { FC, Fragment, ReactNode, useState } from "react";

import { Calendars } from "@/models/Calendars";
import { useCalendarInfoAtomReader, useResourceInfoAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { AnyTimeline, Member, TaskTimeline } from "@/models/data/Setting";
import { SuccessWorkRange, TotalSuccessWorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { Configuration } from "@/models/data/Configuration";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";

type DisplayValue = "workload" | "cost";

interface Props extends ConfigurationProps {
	totalSuccessWorkRange: TotalSuccessWorkRange | undefined;
	successWorkRanges: ReadonlyArray<SuccessWorkRange>;
	sequenceTimelines: ReadonlyArray<AnyTimeline>;
}

const WorkViewer: FC<Props> = (props: Props) => {
	const resourceInfoAtomReader = useResourceInfoAtomReader();

	const [displayValue, setDisplayValue] = useState<DisplayValue>("workload");
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
				<select
					value={displayValue}
					onChange={ev => setDisplayValue(ev.target.value as DisplayValue)}
				>
					<option value={"workload" satisfies DisplayValue}>workload</option>
					<option value={"cost" satisfies DisplayValue}>cost</option>
				</select>
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
									{renderMember(displayValue, firstMember, months, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges, props.configuration)}
								</tr>
								{nextMembers.map(b => {
									return (
										<tr key={b.id}>
											{renderMember(displayValue, b, months, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges, props.configuration)}
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

function renderMember(displayValue: DisplayValue, member: Member, months: ReadonlyArray<DateTime>, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>, configuration: Configuration): ReactNode {
	return (
		<Fragment key={member.id}>
			<td>
				{member.name}
			</td>

			{months.map(a => {
				const range = {
					begin: a,
					end: a.getLastDayOfMonth().add(23, "hour").add(59, "minute"), //TODO: ミリ秒追加がないんだわ
				};

				const percent = calcDisplayValue(member, range.begin, range.end, calendarInfo, taskTimelines, successWorkRanges);

				return (
					<td key={a.ticks}>
						{Require.switch(displayValue as DisplayValue, {
							workload: _ => (
								<>
									<code>
										{Timelines.displayProgress(percent)}
									</code>
									<span>%</span>
								</>
							),
							cost: _ => (
								<>
									<code>
										{(Math.ceil(member.price.cost * percent * configuration.workingDays)).toLocaleString()}
									</code>
									<span>/</span>
									<code>
										{Math.ceil(member.price.sales * percent * configuration.workingDays).toLocaleString()}
									</code>
								</>
							),
						})}
					</td>
				);
			})}
		</Fragment>
	);
}

function getWorkDays(begin: DateTime, end: DateTime, calendarInfo: CalendarInfo): Array<DateTime> {
	const rangeDays = Calendars.getDays(begin, end);

	const workDays = rangeDays.filter(a => {
		const holidayEvent = calendarInfo.holidayEventMap.get(a.ticks);
		if (holidayEvent) {
			return false;
		}

		return !calendarInfo.holidayRegulars.has(a.week);
	});

	return workDays;
}

function calcDisplayValue(member: Member, begin: DateTime, end: DateTime, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>): number {

	const workDays = getWorkDays(begin, end, calendarInfo);

	const memberTimelines = taskTimelines.filter(a => a.memberId === member.id);
	const memberWorkRanges = successWorkRanges.filter(a => memberTimelines.some(b => b.id === a.timeline.id));

	const memberWorkDays = new Array<DateTime>();
	for (const workDay of workDays) {
		for (const memberWorkRange of memberWorkRanges) {
			if (workDay.isIn(memberWorkRange.begin, memberWorkRange.end)) {
				memberWorkDays.push(workDay);
			}
		}
	}

	return memberWorkDays.length / workDays.length;

	// switch (displayValue) {
	// 	case "workload":
	// 		return calcDisplayValueWorkload(member, begin, end, calendarInfo, taskTimelines, totalSuccessWorkRange);

	// 	case "cost":
	// 		return calcDisplayValueCost(member, begin, end, calendarInfo, taskTimelines, totalSuccessWorkRange);

	// 	default:
	// 		throw new Error();
	// }
}
