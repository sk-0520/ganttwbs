import { FC, FormEvent } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import CalendarHolidaySettingEditor from "@/components/elements/pages/editor/setting/Calendar/CalendarHolidaySettingEditor";
import CalendarRangeSettingEditor from "@/components/elements/pages/editor/setting/Calendar/CalendarRangeSettingEditor";
import CalendarWeekSettingEditor from "@/components/elements/pages/editor/setting/Calendar/CalendarWeekSettingEditor";
import GeneralEditor from "@/components/elements/pages/editor/setting/General/GeneralEditor";
import ResourceEditor from "@/components/elements/pages/editor/setting/Resource/ResourceEditor";
import ThemeCalendarSettingEditor from "@/components/elements/pages/editor/setting/Theme/ThemeCalendarSettingEditor";
import ThemeGroupSettingEditor from "@/components/elements/pages/editor/setting/Theme/ThemeGroupSettingEditor";
import ThemeTimelineSettingEditor from "@/components/elements/pages/editor/setting/Theme/ThemeTimelineSettingEditor";
import { useLocale } from "@/locales/locale";
import { Configuration } from "@/models/data/Configuration";
import { MemberSetting, SettingContext } from "@/models/data/context/SettingContext";
import { EditorData } from "@/models/data/EditorData";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { DateOnly, HolidayEvent, HolidayKind, Setting, WeekDay } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { Storages } from "@/models/Storages";
import { Strings } from "@/models/Strings";
import { TimeZone } from "@/models/TimeZone";

const NewLine = "\r\n";

interface Props extends ConfigurationProps {
	editData: EditorData;
}

const SettingEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const setting = toContext(props.configuration, props.editData.setting);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();

		props.editData.setting = fromContext(props.editData.setting, setting);
		console.debug(setting);
		//TODO: 自動保存とぶつかる可能性あり、、、同一オブジェクトなので大丈夫、か？
		Storages.saveEditorData(props.editData);

		window.location.reload();
	}

	return (
		<SettingContext.Provider value={setting}>
			<form onSubmit={handleSubmit}>
				<Tabs defaultIndex={props.configuration.tabIndex.setting} forceRenderTabPanel={true}>
					<TabList>
						<Tab>
							{locale.editor.setting.tabs.general}
						</Tab>
						<Tab>
							{locale.editor.setting.tabs.resource}
						</Tab>
						<Tab>
							{locale.editor.setting.tabs.calendar}
						</Tab>
						<Tab>
							{locale.editor.setting.tabs.theme}
						</Tab>
					</TabList>

					<TabPanel className='setting-tab-item general'>
						<GeneralEditor />
					</TabPanel>

					<TabPanel className='setting-tab-item resource'>
						<ResourceEditor />
					</TabPanel>

					<TabPanel className='setting-tab-item calendar'>
						<dl className="inputs">
							<dt>
								{locale.editor.setting.calendar.range.title}
							</dt>
							<dd className="range">
								<CalendarRangeSettingEditor />
							</dd>

							<dt>
								{locale.editor.setting.calendar.week.title}
							</dt>
							<dd className="week">
								<CalendarWeekSettingEditor />
							</dd>

							<dt>
								{locale.editor.setting.calendar.holiday.title}
							</dt>
							<dd className="holiday">
								<CalendarHolidaySettingEditor />
							</dd>
						</dl>
					</TabPanel>

					<TabPanel className='setting-tab-item theme'>
						<dl className='inputs'>
							<dt>
								{locale.editor.setting.theme.calendar.title}
							</dt>
							<dd>
								<ThemeCalendarSettingEditor />
							</dd>
							<dt>
								{locale.editor.setting.theme.group.title}
							</dt>
							<dd>
								<ThemeGroupSettingEditor />
							</dd>
							<dt>
								{locale.editor.setting.theme.timeline.title}
							</dt>
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
		.sort((a, b) => a.date.compare(b.date))
		.map(a => `${a.date.format("yyyy-MM-dd")}\t${a.display}`)
		.join(NewLine) + NewLine;
}

function toContext(configuration: Configuration, setting: Setting): SettingContext {
	const timeZone = TimeZone.tryParse(setting.timeZone) ?? TimeZone.getClientTimeZone();
	const colors = {
		holiday: {
			regular: DefaultSettings.getRegularHolidays(),
			event: DefaultSettings.getEventHolidayColors(),
		},
	};

	return {
		general: {
			name: setting.name,
			recursive: setting.recursive,
			version: setting.version,
			timeZone: timeZone,
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
					normal: toCalendarHolidayEventContext("normal", setting.calendar.holiday.events, timeZone),
					special: toCalendarHolidayEventContext("special", setting.calendar.holiday.events, timeZone),
				}
			},
		},
		theme: {
			holiday: {
				regulars: {
					monday: setting.theme.holiday.regulars.monday ?? colors.holiday.regular.get("monday") ?? DefaultSettings.BusinessWeekdayColor,
					tuesday: setting.theme.holiday.regulars.tuesday ?? colors.holiday.regular.get("tuesday") ?? DefaultSettings.BusinessWeekdayColor,
					wednesday: setting.theme.holiday.regulars.wednesday ?? colors.holiday.regular.get("wednesday") ?? DefaultSettings.BusinessWeekdayColor,
					thursday: setting.theme.holiday.regulars.thursday ?? colors.holiday.regular.get("thursday") ?? DefaultSettings.BusinessWeekdayColor,
					friday: setting.theme.holiday.regulars.friday ?? colors.holiday.regular.get("friday") ?? DefaultSettings.BusinessWeekdayColor,
					saturday: setting.theme.holiday.regulars.saturday ?? colors.holiday.regular.get("saturday") ?? DefaultSettings.BusinessWeekdayColor,
					sunday: setting.theme.holiday.regulars.sunday ?? colors.holiday.regular.get("sunday") ?? DefaultSettings.BusinessWeekdayColor,
				},
				events: {
					normal: setting.theme.holiday.events.normal ?? colors.holiday.event.normal,
					special: setting.theme.holiday.events.special ?? colors.holiday.event.special,
				}
			},
			groups: setting.theme.groups.map(a => ({
				key: IdFactory.createReactKey(),
				value: a,
			})),
			timeline: {
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
	const timeZone = context.general.timeZone;

	return {
		name: context.general.name,
		recursive: context.general.recursive,
		version: context.general.version,
		timeZone: timeZone.serialize(),
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
					...fromCalendarHolidayEventsContext("normal", context.calendar.holiday.events.normal, timeZone),
					...fromCalendarHolidayEventsContext("special", context.calendar.holiday.events.special, timeZone),
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
					normal: context.theme.holiday.events.normal,
					special: context.theme.holiday.events.special,
				}
			},
			groups: context.theme.groups.map(a => a.value),
			timeline: {
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
