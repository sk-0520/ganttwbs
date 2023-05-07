import { FC } from "react";

import { useLocale } from "@/locales/locale";
import { Calendars } from "@/models/Calendars";
import { DayInfo } from "@/models/data/DayInfo";
import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline } from "@/models/data/Setting";
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

	// ソート済み重複メンバー取得
	const sortedMembers = [...mergedDayInfo.duplicateMembers]
		.map(a => props.resourceInfo.memberMap.get(a) as MemberGroupPair)
		.sort((a, b) => {
			const groupIndex = props.resourceInfo.groupItems.indexOf(a.group);
			const groupCompare = groupIndex - props.resourceInfo.groupItems.indexOf(b.group);
			if (!groupCompare) {
				return groupCompare;
			}
			const group = props.resourceInfo.groupItems[groupIndex];
			const members = props.resourceInfo.memberItems.get(group);
			if (!members) {
				throw new Error();
			}
			return members.indexOf(a.member) - members.indexOf(b.member);
		})
		;

	// ソート済みタイムライン取得
	const sortedTimelines = [...mergedDayInfo.targetTimelines]
		.map(a => props.timelineStore.totalItemMap.get(a) as AnyTimeline)
		.sort((a, b) => {
			const aIndex = props.timelineStore.indexItemMap.get(a.id) ?? -1; // TODO: 落とした方がいいかも
			const bIndex = props.timelineStore.indexItemMap.get(b.id) ?? -1;
			return aIndex - bIndex;
		});


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
									{sortedMembers.map(a => {
										return (
											<li
												key={a.member.id}
												title={a.member.id}
											>
												{Strings.replaceMap(
													locale.pages.editor.timeline.information.memberFormat,
													{
														"MEMBER": a.member.name,
														"GROUP": a.group.name,
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
									{sortedTimelines.map(i => {
										return (
											<li
												key={i.id}
												title={i.id}
											>
												{Timelines.toIndexNumber(props.timelineStore.calcDisplayId(i))}
												:
												{i.subject}
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
