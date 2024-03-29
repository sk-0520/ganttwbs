import classNames from "classnames";
import { FC, Fragment, ReactNode } from "react";

import { Locale, useLocale } from "@/locales/locale";
import { useCalendarInfoAtomReader, useResourceInfoAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { Calendars } from "@/models/Calendars";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { Configuration } from "@/models/data/Configuration";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { DateTimeRange } from "@/models/data/Range";
import { AnyTimeline, Member, TaskTimeline } from "@/models/data/Setting";
import { SuccessWorkRange, TotalSuccessWorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";
import { Strings } from "@/models/Strings";
import { Timelines } from "@/models/Timelines";

const HeaderColumn = {
	InvisibleCostLength: 2,
	VisibleCostLength: 4,
} as const;

interface Props extends ConfigurationProps {
	totalSuccessWorkRange: TotalSuccessWorkRange | undefined;
	successWorkRanges: ReadonlyArray<SuccessWorkRange>;
	sequenceTimelines: ReadonlyArray<AnyTimeline>;
}

const WorkViewer: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const resourceInfoAtomReader = useResourceInfoAtomReader();

	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const visibleCost = true;

	const months = props.totalSuccessWorkRange
		? Calendars.getMonths(props.totalSuccessWorkRange.minimum.begin, props.totalSuccessWorkRange.maximum.end)
		: []
		;
	const taskTimelines = props.sequenceTimelines.filter(Settings.maybeTaskTimeline);

	return (
		<section className="workload">
			<h2>
				{locale.pages.editor.analytics.works.title}
			</h2>

			<table>
				<caption>
					{locale.pages.editor.analytics.works.month.title}
				</caption>
				<thead>
					<tr>
						<th rowSpan={2}>
							{locale.pages.editor.analytics.works.resource.group}
						</th>
						<th rowSpan={2}>
							{locale.pages.editor.analytics.works.resource.member}
						</th>
						{renderMonths(visibleCost, months, locale)}
					</tr>
					<tr>
						{months.map(_ => {
							return (
								<>
									{visibleCost
										? (
											<>
												<th>
													{locale.pages.editor.analytics.works.header.workload}
												</th>
												<th>
													{locale.pages.editor.analytics.works.header.workday}
												</th>
												<th>
													{locale.pages.editor.analytics.works.header.cost}
												</th>
												<th>
													{locale.pages.editor.analytics.works.header.sales}
												</th>
											</>
										) : (
											<>
												<th>
													{locale.pages.editor.analytics.works.header.workload}
												</th>
												<th>
													{locale.pages.editor.analytics.works.header.workday}
												</th>
											</>
										)
									}
								</>
							);
						})}
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
									{renderMember(visibleCost, firstMember, months, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges, props.configuration)}
								</tr>
								{nextMembers.map(b => {
									return (
										<tr key={b.id}>
											{renderMember(visibleCost, b, months, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges, props.configuration)}
										</tr>
									);
								})}
							</Fragment>
						);
					})}
				</tbody>
			</table>

			{props.totalSuccessWorkRange && (
				<table>
					<caption>
						{Strings.replaceMap(locale.pages.editor.analytics.works.total.titleFormat, {
							"TITLE": locale.pages.editor.analytics.works.total.title,
							"BEGIN": props.totalSuccessWorkRange.minimum.begin.format(locale.common.calendar.dateOnlyFormat),
							"END": props.totalSuccessWorkRange.maximum.end.format(locale.common.calendar.dateOnlyFormat),
						})}
					</caption>
					<thead>
						<tr>
							<th>
								{locale.pages.editor.analytics.works.resource.group}
							</th>
							<th>
								{locale.pages.editor.analytics.works.resource.member}
							</th>
							<>
								{visibleCost
									? (
										<>
											<th>
												{locale.pages.editor.analytics.works.header.workload}
											</th>
											<th>
												{locale.pages.editor.analytics.works.header.workday}
											</th>
											<th>
												{locale.pages.editor.analytics.works.header.cost}
											</th>
											<th>
												{locale.pages.editor.analytics.works.header.sales}
											</th>
										</>
									) : (
										<>
											<th>
												{locale.pages.editor.analytics.works.header.workload}
											</th>
											<th>
												{locale.pages.editor.analytics.works.header.workday}
											</th>
										</>
									)
								}
							</>
						</tr>
					</thead>
					<tbody>
						{resourceInfoAtomReader.data.groupItems.map(a => {
							if (!a.members.length) {
								return <></>;
							}

							if (!props.totalSuccessWorkRange) {
								throw new Error();
							}

							const range: DateTimeRange = {
								begin: props.totalSuccessWorkRange.minimum.begin,
								end: props.totalSuccessWorkRange.maximum.end,
							};

							const members = [...Require.get(resourceInfoAtomReader.data.memberItems, a)];
							const firstMember = members[0];
							const nextMembers = members;
							nextMembers.shift();

							const monthCount = Calendars.getMonthCount(range.begin, range.end);

							return (
								<Fragment key={a.id}>
									<tr>
										<td
											rowSpan={nextMembers.length + 1}
										>
											{a.name}
										</td>
										<td>
											{firstMember.name}
										</td>
										{renderRange(visibleCost, firstMember, range, monthCount, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges, props.configuration)}
									</tr>
									{nextMembers.map(b => {
										return (
											<tr key={b.id}>
												<td>
													{b.name}
												</td>
												{renderRange(visibleCost, b, range, monthCount, calendarInfoAtomReader.data, taskTimelines, props.successWorkRanges, props.configuration)}
											</tr>
										);
									})}
								</Fragment>
							);
						})}
					</tbody>
				</table>
			)}

		</section>
	);
};

export default WorkViewer;

function renderMonths(visibleCost: boolean, months: ReadonlyArray<DateTime>, locale: Locale): ReactNode {
	return months.map(a => {
		return (
			<th
				key={a.ticks}
				colSpan={visibleCost ? HeaderColumn.VisibleCostLength : HeaderColumn.InvisibleCostLength}
			>
				<time dateTime={a.toHtml("time")}>
					{a.format(locale.common.calendar.yearMonthFormat)}
				</time>
			</th>
		);
	});
}

function renderRange(visibleCost: boolean, member: Member, range: DateTimeRange, monthCount: number, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>, configuration: Configuration): ReactNode {
	const workDays = Calendars.getWorkDays(range, calendarInfo.holidayRegulars, calendarInfo.holidayEventMap);
	const percent = Timelines.calculateWorkPercent(member, workDays, taskTimelines, successWorkRanges);
	const overwork = 1 < percent;

	return (
		<>
			<td className={
				classNames(
					"workload",
					{
						"overwork": overwork,
					}
				)}
			>
				<code>
					{Timelines.displayProgress(percent)}
				</code>
			</td>
			<td className={
				classNames(
					"workday",
					{
						"overwork": overwork,
					}
				)}
			>
				{Math.round(percent * workDays.length)}
			</td>
			{visibleCost && (
				<>
					<td className={
						classNames(
							"cost",
							{
								"overwork": overwork,
							}
						)}
					>
						<code>
							{(Math.ceil(member.price.cost * percent * (monthCount * configuration.workingDays))).toLocaleString()}
						</code>
					</td>
					<td className={
						classNames(
							"sales",
							{
								"overwork": overwork,
							}
						)}
					>
						<code>
							{Math.ceil(member.price.sales * percent * (monthCount * configuration.workingDays)).toLocaleString()}
						</code>
					</td>
				</>
			)}
		</>
	);
}

function renderMember(visibleCost: boolean, member: Member, months: ReadonlyArray<DateTime>, calendarInfo: CalendarInfo, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>, configuration: Configuration): ReactNode {
	return (
		<Fragment key={member.id}>
			<td>
				{member.name}
			</td>

			{months.map(a => {
				const range: DateTimeRange = {
					begin: a,
					end: a.getLastDayOfMonth(),
				};

				return renderRange(visibleCost, member, range, 1, calendarInfo, taskTimelines, successWorkRanges, configuration);
			})}
		</Fragment>
	);
}


