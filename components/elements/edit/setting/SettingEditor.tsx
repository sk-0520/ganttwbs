import { NextPage } from "next";
import { FormEvent, useContext, useState } from "react";
//import { useForm } from "react-hook-form";
import { EditContext } from "@/models/data/context/EditContext";
import { WeekDay } from "@/models/data/setting/WeekDay";
import { useForm } from "react-hook-form";
import WeekSettingEditor from "./WeekSettingEditor";
import { SettingContext } from "@/models/data/context/SettingContext";
import { Setting } from "@/models/data/setting/Setting";
import * as Storage from "@/models/Storage";

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
				<section>
					<h2>メンバー</h2>
				</section>
				<section>
					<h2>カレンダー</h2>
					<section>
						<h3>曜日設定</h3>
						<WeekSettingEditor />
					</section>
				</section>
				<section>
					<h2>テーマ</h2>
				</section>

				<button>submit</button>
			</form>
		</SettingContext.Provider>
	);
};

export default Component;

function toContext(setting: Setting): SettingContext {
	return {
		calendar: {
			range: {
				from: setting.calendar.range.from,
				to: setting.calendar.range.to,
			},
			holiday: {
				week: {
					monday: setting.calendar.holiday.regulars.includes('monday'),
					tuesday: setting.calendar.holiday.regulars.includes('tuesday'),
					wednesday: setting.calendar.holiday.regulars.includes('wednesday'),
					thursday: setting.calendar.holiday.regulars.includes('thursday'),
					friday: setting.calendar.holiday.regulars.includes('friday'),
					saturday: setting.calendar.holiday.regulars.includes('saturday'),
					sunday: setting.calendar.holiday.regulars.includes('sunday'),
				},
				holidays: '',
				specials: '',
			},
		}
	};
}


function fromContext(source: Setting, context: SettingContext): Setting {
	return {
		name: source.name,
		calendar: {
			range: {
				from: context.calendar.range.from,
				to: context.calendar.range.to,
			},
			holiday: {
				regulars: new Array<{ week: WeekDay, value: boolean }>().concat([
					{ week: 'sunday', value: context.calendar.holiday.week.sunday },
					{ week: 'monday', value: context.calendar.holiday.week.monday },
					{ week: 'tuesday', value: context.calendar.holiday.week.tuesday },
					{ week: 'wednesday', value: context.calendar.holiday.week.wednesday },
					{ week: 'thursday', value: context.calendar.holiday.week.thursday },
					{ week: 'friday', value: context.calendar.holiday.week.friday },
					{ week: 'saturday', value: context.calendar.holiday.week.saturday },
				]).filter(a => a.value).map(a => a.week),
				events: {}
			}
		},
		theme: {
			holiday: {
				regulars: {
					monday: '#000',
					tuesday: '#f00',
					wednesday: '#0f0',
					thursday: '#00f',
					friday: '#ff0',
					saturday: '#0ff',
					sunday: '#f0f',
				},
				events: {}
			},
			groups: [
				'#444',
			],
			end: '#123',
		},
		timelines: [],
		versions: []
	};
}
