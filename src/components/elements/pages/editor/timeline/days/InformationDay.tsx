import { FC } from "react";

import { useLocale } from "@/locales/locale";
import { Calendars } from "@/models/Calendars";
import { DayInfo } from "@/models/data/DayInfo";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { DateTime } from "@/models/DateTime";
import { Days } from "@/models/Days";
import { Strings } from "@/models/Strings";
import { Timelines } from "@/models/Timelines";

interface Props extends SettingProps, CalendarInfoProps, ResourceInfoProps, TimelineStoreProps {
	readonly date: DateTime;
}

const InformationDay: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const holidayEventValue = Calendars.getHolidayEventValue(props.date, props.calendarInfo.holidayEventMap);
	const classNames = Days.getDayClassNames(props.date, props.setting.calendar.holiday.regulars, holidayEventValue, props.setting.theme);
	const className = Days.getCellClassName(classNames);

	const mergedDayInfo: DayInfo = {
		duplicateMembers: new Set(),
		targetTimelines: new Set(),
	};
	const nextDay = props.date.add(1, "day");
	for (const [ticks, info] of props.timelineStore.dayInfos) {
		if (props.date.ticks <= ticks && ticks < nextDay.ticks) {
			for (const memberId of info.duplicateMembers) {
				mergedDayInfo.duplicateMembers.add(memberId);
			}
			for (const timelineId of info.targetTimelines) {
				mergedDayInfo.targetTimelines.add(timelineId);
			}
		}
	}

	return (
		<td
			key={props.date.ticks}
			title={holidayEventValue?.event.display}
			className={className}
		>
			{0 < mergedDayInfo.duplicateMembers.size ? (
				<details>
					<summary>@</summary>
					<div className="contents">
						<dl>
							<dt>
								{props.date.format(locale.common.calendar.dateOnlyFormat)}
							</dt>

							<dt>
								{locale.pages.editor.timeline.information.memberDuplication}
							</dt>
							<dd>
								<ul>
									{[...mergedDayInfo.duplicateMembers].map(b => {
										const member = props.resourceInfo.memberMap.get(b);
										if (!member) {
											throw new Error();
										}
										return (
											<li
												key={member.member.id}
												title={member.member.id}
											>
												{Strings.replaceMap(
													locale.pages.editor.timeline.information.memberFormat,
													{
														"MEMBER": member.member.name,
														"GROUP": member.group.name,
													}
												)}
											</li>
										);
									})}
								</ul>
							</dd>

							<dt>
								{locale.pages.editor.timeline.information.timelineAffected}
							</dt>
							<dd>
								<ul>
									{[...mergedDayInfo.targetTimelines].map(b => {
										const timeline = props.timelineStore.totalItemMap.get(b);
										if (!timeline) {
											throw new Error();
										}

										return (
											<li
												key={timeline.id}
												title={timeline.id}
											>
												{Timelines.toIndexNumber(props.timelineStore.calcDisplayId(timeline))}
												:
												{timeline.subject}
											</li>
										);
									})}
								</ul>
							</dd>
						</dl>
					</div>
				</details>
			) : (
				<>&nbsp;</>
			)}
		</td>
	);
};

export default InformationDay;
