import { FC, FormEvent } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import CalendarHolidaySettingEditor from "@/components/elements/pages/editor/setting/Calendar/CalendarHolidaySettingEditor";
import CalendarRangeSettingEditor from "@/components/elements/pages/editor/setting/Calendar/CalendarRangeSettingEditor";
import CalendarWeekSettingEditor from "@/components/elements/pages/editor/setting/Calendar/CalendarWeekSettingEditor";
import GeneralEditor from "@/components/elements/pages/editor/setting/General/GeneralEditor";
import GroupsEditor from "@/components/elements/pages/editor/setting/Group/GroupsEditor";
import ThemeCalendarSettingEditor from "@/components/elements/pages/editor/setting/Theme/ThemeCalendarSettingEditor";
import ThemeGroupSettingEditor from "@/components/elements/pages/editor/setting/Theme/ThemeGroupSettingEditor";
import ThemeTimelineSettingEditor from "@/components/elements/pages/editor/setting/Theme/ThemeTimelineSettingEditor";
import { MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { EditorData } from "@/models/data/EditorData";
import { Color, DateOnly, HolidayEvent, HolidayKind, Setting, WeekDay } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { IdFactory } from "@/models/IdFactory";
import { Storage } from "@/models/Storage";
import { Strings } from "@/models/Strings";
import { TimeZone } from "@/models/TimeZone";

const NewLine = "\r\n";
const ThemeHolidayRegularColor: Color = "#0f0";
const ThemeHolidayEventHolidayColor: Color = "#0f0";
const ThemeHolidayEventSpecialColor: Color = "#0f0";

interface Props {
	editData: EditorData;
}

const SettingEditor: FC<Props> = (props: Props) => {
	//const initTabIndex = 0;
	const initTabIndex = 2;

	const setting = toContext(props.editData.setting);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();

		props.editData.setting = fromContext(props.editData.setting, setting);
		console.debug(setting);
		Storage.saveEditorData(props.editData);

		window.location.reload();
	}

	return (
		<SettingContext.Provider value={setting}>
			<form onSubmit={handleSubmit}>
				<Tabs defaultIndex={initTabIndex} forceRenderTabPanel={true}>
					<TabList>
						<Tab>基本</Tab>
						<Tab>人員</Tab>
						<Tab>カレンダー</Tab>
						<Tab>テーマ</Tab>
					</TabList>

					<TabPanel className='setting-tab-item general'>
						<GeneralEditor />
					</TabPanel>

					<TabPanel className='setting-tab-item group'>
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

					<TabPanel className='setting-tab-item theme'>
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

export default SettingEditor;

function toCalendarHolidayEventContext(kind: HolidayKind, items: { [key: DateOnly]: HolidayEvent }, timeZone: TimeZone): string {
	return Object.entries(items)
		.filter(([k, v]) => v.kind === kind)
		.map(([k, v]) => ({ date: DateTime.parse(k, timeZone), display: v.display }))
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map(a => `${a.date.format("yyyy-MM-dd")}\t${a.display}`)
		.join(NewLine) + NewLine;
}

function toContext(setting: Setting): SettingContext {
	const timeZone = TimeZone.parse(setting.timeZone) ?? TimeZone.getClientTimeZone();

	return {
		general: {
			name: setting.name,
			recursive: setting.recursive,
			version: setting.version,
			timeZone: setting.timeZone,
		},
		groups: setting.groups.map(a => ({
			key: IdFactory.createReactKey(),
			name: a.name,
			members: a.members.map<MemberSetting>(b => ({
				key: IdFactory.createReactKey(),
				id: b.id,
				name: b.name,
				color: b.color,
				priceCost: b.price.cost,
				priceSales: b.price.sales,
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
					holidays: toCalendarHolidayEventContext("holiday", setting.calendar.holiday.events, timeZone),
					specials: toCalendarHolidayEventContext("special", setting.calendar.holiday.events, timeZone),
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
				key: IdFactory.createReactKey(),
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

function fromCalendarHolidayEventsContext(kind: HolidayKind, context: string, timeZone: TimeZone): { [key: DateOnly]: HolidayEvent } {
	const result: { [key: DateOnly]: HolidayEvent } = {};

	const items = Strings.splitLines(context)
		.filter(a => a && a.trim())
		.map(a => a.split("\t", 2))
		.map(a => ({ date: a[0], display: 1 in a ? a[1] : "" }))
		.map(a => ({ date: DateTime.tryParse(a.date, timeZone), display: a.display }))
		.filter(a => a.date)
		;
	for (const item of items) {
		if (!item.date) {
			throw new Error("filter");
		}
		result[item.date.format("yyyy-MM-dd")] = {
			display: item.display,
			kind: kind
		};
	}

	return result;
}

function fromContext(source: Readonly<Setting>, context: SettingContext): Setting {
	const timeZone = TimeZone.parse(context.general.timeZone) ?? TimeZone.getClientTimeZone();

	return {
		name: context.general.name,
		recursive: context.general.recursive,
		version: context.general.version,
		timeZone: context.general.timeZone,
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
					...fromCalendarHolidayEventsContext("holiday", context.calendar.holiday.events.holidays, timeZone),
					...fromCalendarHolidayEventsContext("special", context.calendar.holiday.events.specials, timeZone),
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
				price: {
					cost: b.priceCost,
					sales: b.priceSales,
				},
			})),
		})),
		rootTimeline: source.rootTimeline,
		versions: []
	};
}
