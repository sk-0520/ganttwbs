import { NextPage } from "next";
import { FormEvent } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { v4 } from "uuid";

import { Storage } from "@/models/Storage";
import { MemberSetting, SettingContext } from "@/models/data/context/SettingContext";

import CalendarHolidaySettingEditor from "./Calendar/CalendarHolidaySettingEditor";
import CalendarRangeSettingEditor from "./Calendar/CalendarRangeSettingEditor";
import CalendarWeekSettingEditor from "./Calendar/CalendarWeekSettingEditor";
import GroupsEditor from "./Group/GroupsEditor";
import ThemeCalendarSettingEditor from "./Theme/ThemeCalendarSettingEditor";
import ThemeTimelineSettingEditor from "./Theme/ThemeTimelineSettingEditor";
import ThemeGroupSettingEditor from "./Theme/ThemeGroupSettingEditor";
import { Color, DateOnly, HolidayEvent, HolidayKind, Setting, WeekDay } from "@/models/data/Setting";
import { Strings } from "@/models/Strings";
import { EditData } from "@/models/data/EditData";
import GeneralEditor from "./General/GeneralEditor";

const NewLine = "\r\n";
const ThemeHolidayRegularColor: Color = "#0f0";
const ThemeHolidayEventHolidayColor: Color = "#0f0";
const ThemeHolidayEventSpecialColor: Color = "#0f0";

interface Props {
	editData: EditData;
}

const Component: NextPage<Props> = (props: Props) => {

	const setting = toContext(props.editData.setting);

	function onSubmit(event: FormEvent) {
		event.preventDefault();

		props.editData.setting = fromContext(props.editData.setting, setting);
		console.debug(setting);
		Storage.saveEditData(props.editData);

		window.location.reload();
	}

	return (
		<SettingContext.Provider value={setting}>
			<form onSubmit={onSubmit}>
				<Tabs forceRenderTabPanel={true}>
					<TabList>
						<Tab>基本</Tab>
						<Tab>人員</Tab>
						<Tab>カレンダー</Tab>
						<Tab>テーマ</Tab>
					</TabList>

					<TabPanel className='setting-tab-item'>
						<GeneralEditor />
					</TabPanel>

					<TabPanel className='setting-tab-item'>
						<GroupsEditor />
					</TabPanel>

					<TabPanel className='setting-tab-item calendar'>
						<dl className="inputs">
							<dt>日付範囲</dt>
							<dd className="range">
								<CalendarRangeSettingEditor />
							</dd>

							<dt>曜日設定</dt>
							<dd className="week">
								<CalendarWeekSettingEditor />
							</dd>

							<dt>祝日</dt>
							<dd className="holiday">
								<CalendarHolidaySettingEditor />
							</dd>
						</dl>
					</TabPanel>

					<TabPanel className='setting-tab-item'>
						<dl className='inputs'>
							<dt>カレンダー</dt>
							<dd>
								<ThemeCalendarSettingEditor />
							</dd>
							<dt>グループ</dt>
							<dd>
								<ThemeGroupSettingEditor />
							</dd>
							<dt>タイムライン</dt>
							<dd>
								<ThemeTimelineSettingEditor />
							</dd>
						</dl>
					</TabPanel>
				</Tabs>

				<button className="action setting-save">submit</button>
			</form>
		</SettingContext.Provider>
	);
};

export default Component;

function toCalendarHolidayEventContext(kind: HolidayKind, items: { [key: DateOnly]: HolidayEvent }): string {
	return Object.entries(items)
		.filter(([k, v]) => v.kind === kind)
		.map(([k, v]) => ({ date: new Date(k), display: v.display }))
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map(a => `${a.date.toISOString().split("T")[0]}\t${a.display}`)
		.join(NewLine)
		;

}

function toContext(setting: Setting): SettingContext {
	return {
		general: {
			name: setting.name,
			recursive: setting.recursive,
		},
		groups: setting.groups.map(a => ({
			key: v4(),
			name: a.name,
			members: a.members.map<MemberSetting>(b => ({
				key: v4(),
				id: b.id,
				name: b.name,
				color: b.color,
			})).sort((a, b) => a.name.localeCompare(b.name))
		})).sort((a, b) => a.name.localeCompare(b.name)),
		calendar: {
			range: {
				from: setting.calendar.range.from,
				to: setting.calendar.range.to,
			},
			holiday: {
				regulars: {
					monday: setting.calendar.holiday.regulars.includes("monday"),
					tuesday: setting.calendar.holiday.regulars.includes("tuesday"),
					wednesday: setting.calendar.holiday.regulars.includes("wednesday"),
					thursday: setting.calendar.holiday.regulars.includes("thursday"),
					friday: setting.calendar.holiday.regulars.includes("friday"),
					saturday: setting.calendar.holiday.regulars.includes("saturday"),
					sunday: setting.calendar.holiday.regulars.includes("sunday"),
				},
				events: {
					holidays: toCalendarHolidayEventContext("holiday", setting.calendar.holiday.events),
					specials: toCalendarHolidayEventContext("special", setting.calendar.holiday.events),
				}
			},
		},
		theme: {
			holiday: {
				regulars: {
					monday: setting.theme.holiday.regulars.monday ?? ThemeHolidayRegularColor,
					tuesday: setting.theme.holiday.regulars.tuesday ?? ThemeHolidayRegularColor,
					wednesday: setting.theme.holiday.regulars.wednesday ?? ThemeHolidayRegularColor,
					thursday: setting.theme.holiday.regulars.thursday ?? ThemeHolidayRegularColor,
					friday: setting.theme.holiday.regulars.friday ?? ThemeHolidayRegularColor,
					saturday: setting.theme.holiday.regulars.saturday ?? ThemeHolidayRegularColor,
					sunday: setting.theme.holiday.regulars.sunday ?? ThemeHolidayRegularColor,
				},
				events: {
					holiday: setting.theme.holiday.events.holiday ?? ThemeHolidayEventHolidayColor,
					special: setting.theme.holiday.events.special ?? ThemeHolidayEventSpecialColor,
				}
			},
			groups: setting.theme.groups.map(a => ({
				key: v4(),
				value: a,
			})),
			timeline: {
				group: setting.theme.timeline.group,
				defaultGroup: setting.theme.timeline.defaultGroup,
				defaultTask: setting.theme.timeline.defaultTask,
				completed: setting.theme.timeline.completed,
			}
		}
	};
}

function fromCalendarHolidayEventsContext(kind: HolidayKind, context: string): { [key: DateOnly]: HolidayEvent } {
	const result: { [key: DateOnly]: HolidayEvent } = {};

	const items = Strings.splitLines(context)
		.filter(a => a && a.trim())
		.map(a => a.split("\t", 2))
		.map(a => ({ date: a[0], display: a[1] }))
		.map(a => ({ date: new Date(a.date), display: a.display }))
		.filter(a => !isNaN(a.date.getTime()))
		;

	for (const item of items) {
		result[item.date.toISOString().split("T")[0]] = {
			display: item.display,
			kind: kind
		};
	}

	return result;
}

function fromContext(source: Readonly<Setting>, context: SettingContext): Setting {
	return {
		name: context.general.name,
		recursive: context.general.recursive,
		calendar: {
			range: {
				from: context.calendar.range.from,
				to: context.calendar.range.to,
			},
			holiday: {
				regulars: new Array<{ week: WeekDay, value: boolean }>().concat([
					{ week: "monday", value: context.calendar.holiday.regulars.monday },
					{ week: "tuesday", value: context.calendar.holiday.regulars.tuesday },
					{ week: "wednesday", value: context.calendar.holiday.regulars.wednesday },
					{ week: "thursday", value: context.calendar.holiday.regulars.thursday },
					{ week: "friday", value: context.calendar.holiday.regulars.friday },
					{ week: "saturday", value: context.calendar.holiday.regulars.saturday },
					{ week: "sunday", value: context.calendar.holiday.regulars.sunday },
				]).filter(a => a.value).map(a => a.week),
				events: {
					...fromCalendarHolidayEventsContext("holiday", context.calendar.holiday.events.holidays),
					...fromCalendarHolidayEventsContext("special", context.calendar.holiday.events.specials),
				}
			}
		},
		theme: {
			holiday: {
				regulars: {
					monday: context.theme.holiday.regulars.monday,
					tuesday: context.theme.holiday.regulars.tuesday,
					wednesday: context.theme.holiday.regulars.wednesday,
					thursday: context.theme.holiday.regulars.thursday,
					friday: context.theme.holiday.regulars.friday,
					saturday: context.theme.holiday.regulars.saturday,
					sunday: context.theme.holiday.regulars.sunday,
				},
				events: {
					holiday: context.theme.holiday.events.holiday,
					special: context.theme.holiday.events.special,
				}
			},
			groups: context.theme.groups.map(a => a.value),
			timeline: {
				group: context.theme.timeline.group,
				defaultGroup: context.theme.timeline.defaultGroup,
				defaultTask: context.theme.timeline.defaultTask,
				completed: context.theme.timeline.completed,
			},
		},
		groups: context.groups.map(a => ({
			name: a.name,
			members: a.members.map(b => ({
				id: b.id,
				name: b.name,
				color: b.color,
			})),
		})),
		timelineNodes: source.timelineNodes,
		versions: []
	};
}
