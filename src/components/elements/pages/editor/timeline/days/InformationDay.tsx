import { useSetAtom } from "jotai";
import { FC, useRef } from "react";

import { useLocale } from "@/locales/locale";
import { HighlightDaysAtom, HighlightTimelineIdsAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { DayInfo } from "@/models/data/DayInfo";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { TimelineId } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { Days } from "@/models/Days";
import { Editors } from "@/models/Editors";
import { Require } from "@/models/Require";
import { Strings } from "@/models/Strings";
import { Timelines } from "@/models/Timelines";

interface Props extends SettingProps, CalendarInfoProps, ResourceInfoProps, TimelineStoreProps {
	readonly date: DateTime;
}

const InformationDay: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const setHighlightTimelineIds = useSetAtom(HighlightTimelineIdsAtom);
	const setHighlightDays = useSetAtom(HighlightDaysAtom);

	const refDetails = useRef<HTMLDetailsElement>(null);

	// useEffect(() => {
	// 	if (refDetails.current) {
	// 	}
	// }, [refDetails]);

	const holidayEventValue = props.calendarInfo.holidayEventMap.get(props.date.ticks);
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
		.map(a => Require.get(props.resourceInfo.memberMap, a))
		.sort((a, b) => {
			const groupIndex = props.resourceInfo.groupItems.indexOf(a.group);
			const groupCompare = groupIndex - props.resourceInfo.groupItems.indexOf(b.group);
			if (!groupCompare) {
				return groupCompare;
			}
			const group = props.resourceInfo.groupItems[groupIndex];
			const members = Require.get(props.resourceInfo.memberItems, group);
			return members.indexOf(a.member) - members.indexOf(b.member);
		})
		;

	// ソート済みタイムライン取得
	const sortedTimelines = [...mergedDayInfo.targetTimelines]
		.map(a => Require.get(props.timelineStore.totalItemMap, a))
		.sort((a, b) => {
			const aIndex = Require.get(props.timelineStore.indexItemMap, a.id);
			const bIndex = Require.get(props.timelineStore.indexItemMap, b.id);
			return aIndex - bIndex;
		})
		;

	function handleClickTimeline(timelineId: TimelineId): void {
		setHighlightTimelineIds([timelineId]);
		setHighlightDays([props.date]);
		Editors.scrollView(timelineId, props.date);
	}

	function handleClose(): void {
		if (refDetails.current) {
			refDetails.current.open = false;
		}
	}

	return (
		<td
			key={props.date.ticks}
			title={holidayEventValue?.event.display}
			className={className}
		>
			{0 < mergedDayInfo.duplicateMembers.size ? (
				<details
					ref={refDetails}
				>
					<summary>
						{/* U+EF0Fが取り除かれて白黒になる対応(vscodeかjsxかは知らん) */}
						{/*"⚠️"*/}
						{/* 2023-05-07 chrome だと相変わらず白黒なので絵文字変えといた(アイコンを使うと見づらい) */}
						💥
					</summary>
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
										const timelineIndex = props.timelineStore.calcReadableTimelineId(i);
										const timelineClassName = Timelines.getReadableTimelineIdClassName(timelineIndex);

										return (
											<li
												key={i.id}
												title={i.id}
											>
												<a
													className="event"
													href="#"
													onClick={ev => handleClickTimeline(i.id)}
												>
													<span
														className={timelineClassName}
													>
														{Timelines.toReadableTimelineId(timelineIndex)}
														<span className="separator">-</span>
														{i.subject}
													</span>
												</a>
											</li>
										);
									})}
								</ul>
							</dd>
						</dl>
						<div className="close">
							<button
								className="button"
								type="button"
								onClick={handleClose}
							>
								{locale.common.dialog.close}
							</button>
						</div>
					</div>
				</details>
			) : (
				<>&nbsp;</>
			)}
		</td>
	);
};

export default InformationDay;
