import { NextPage } from 'next';
import { FormEvent, useContext } from 'react';
import { v4 } from 'uuid';
import CalendarHolidaySettingEditor from './Calendar/CalendarHolidaySettingEditor';
import CalendarRangeSettingEditor from './Calendar/CalendarRangeSettingEditor';
import CalendarWeekSettingEditor from './Calendar/CalendarWeekSettingEditor';
import GroupsEditor from './Group/GroupsEditor';
import ThemeCalendarSettingEditor from './Theme/ThemeCalendarSettingEditor';
import ThemeCompletedSettingEditor from './Theme/ThemeCompletedSettingEditor';
import ThemeGroupSettingEditor from './Theme/ThemeGroupSettingEditor';
import * as Storage from '@/models/Storage';
import * as string from '@/models/core/string';
import { EditContext } from '@/models/data/context/EditContext';
import { MemberSetting, SettingContext } from '@/models/data/context/SettingContext';
import { Color } from '@/models/data/setting/Color';
import { HolidayKind, HolidayEvent } from '@/models/data/setting/Holiday';
import * as ISO8601 from '@/models/data/setting/ISO8601';
import { Setting } from '@/models/data/setting/Setting';
import { WeekDay } from '@/models/data/setting/WeekDay';

const NewLine = '\r\n';
const ThemeHolidayRegularColor: Color = '#0f0';
const ThemeHolidayEventHolidayColor: Color = '#0f0';
const ThemeHolidayEventSpecialColor: Color = '#0f0';

const Component: NextPage = () => {
	const editContext = useContext(EditContext);

	const setting = toContext(editContext.data.setting);

	function onSubmit(event: FormEvent) {
		event.preventDefault();

		editContext.data.setting = fromContext(editContext.data.setting, setting);
		console.debug(setting);
		Storage.saveEditData(editContext.data);
	}

	return (
		<SettingContext.Provider value={setting}>
			<form onSubmit={onSubmit}>
				<dl className="inputs">
					<dt className="general">基本</dt>
					<dd className="general"></dd>

					<dt className="group">人員</dt>
					<dd className="group">
						<GroupsEditor />
					</dd>

					<dt className="calendar">カレンダー</dt>
					<dd className="calendar">
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

					</dd>

					<dt className="theme">テーマ</dt>
					<dd className="theme">
						<dl className='inputs'>
							<dt>カレンダー</dt>
							<dd>
								<ThemeCalendarSettingEditor />
							</dd>
							<dt>グループ</dt>
							<dd>
								<ThemeGroupSettingEditor />
							</dd>
							<dt>終了</dt>
							<dd>
								<ThemeCompletedSettingEditor />
							</dd>
						</dl>
					</dd>

				</dl>

				<button className="action">submit</button>
			</form>
		</SettingContext.Provider>
	);
};

export default Component;

function toCalendarHolidayEventContext(kind: HolidayKind, items: { [key: ISO8601.Date]: HolidayEvent }): string {
	return Object.entries(items)
		.filter(([k, v]) => v.kind === kind)
		.map(([k, v]) => ({ date: new Date(k), display: v.display }))
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map(a => `${a.date.toISOString().split('T')[0]}\t${a.display}`)
		.join(NewLine)
		;

}

function toContext(setting: Setting): SettingContext {
	return {
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
					monday: setting.calendar.holiday.regulars.includes('monday'),
					tuesday: setting.calendar.holiday.regulars.includes('tuesday'),
					wednesday: setting.calendar.holiday.regulars.includes('wednesday'),
					thursday: setting.calendar.holiday.regulars.includes('thursday'),
					friday: setting.calendar.holiday.regulars.includes('friday'),
					saturday: setting.calendar.holiday.regulars.includes('saturday'),
					sunday: setting.calendar.holiday.regulars.includes('sunday'),
				},
				events: {
					holidays: toCalendarHolidayEventContext('holiday', setting.calendar.holiday.events),
					specials: toCalendarHolidayEventContext('special', setting.calendar.holiday.events),
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
			completed: setting.theme.completed,
		}
	};
}

function fromCalendarHolidayEventsContext(kind: HolidayKind, context: string): { [key: ISO8601.Date]: HolidayEvent } {
	const result: { [key: ISO8601.Date]: HolidayEvent } = {};

	const items = string.splitLines(context)
		.filter(a => a && a.trim())
		.map(a => a.split('\t', 2))
		.map(a => ({ date: a[0], display: a[1] }))
		.map(a => ({ date: new Date(a.date), display: a.display }))
		.filter(a => !isNaN(a.date.getTime()))
		;

	for (const item of items) {
		result[item.date.toISOString().split('T')[0]] = {
			display: item.display,
			kind: kind
		};
	}

	return result;
}

function fromContext(source: Readonly<Setting>, context: SettingContext): Setting {
	return {
		name: source.name,
		calendar: {
			range: {
				from: context.calendar.range.from,
				to: context.calendar.range.to,
			},
			holiday: {
				regulars: new Array<{ week: WeekDay, value: boolean }>().concat([
					{ week: 'monday', value: context.calendar.holiday.regulars.monday },
					{ week: 'tuesday', value: context.calendar.holiday.regulars.tuesday },
					{ week: 'wednesday', value: context.calendar.holiday.regulars.wednesday },
					{ week: 'thursday', value: context.calendar.holiday.regulars.thursday },
					{ week: 'friday', value: context.calendar.holiday.regulars.friday },
					{ week: 'saturday', value: context.calendar.holiday.regulars.saturday },
					{ week: 'sunday', value: context.calendar.holiday.regulars.sunday },
				]).filter(a => a.value).map(a => a.week),
				events: {
					...fromCalendarHolidayEventsContext('holiday', context.calendar.holiday.events.holidays),
					...fromCalendarHolidayEventsContext('special', context.calendar.holiday.events.specials),
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
			completed: context.theme.completed,
		},
		groups: context.groups.map(a => ({
			name: a.name,
			members: a.members.map(b => ({
				id: b.id,
				name: b.name,
				color: b.color,
			})),
		})),
		timelines: [],
		versions: []
	};
}
