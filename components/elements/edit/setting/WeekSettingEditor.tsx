import { NextPage } from "next";
import { useContext } from "react";
//import { useForm } from "react-hook-form";
import { SettingContext } from "@/models/data/context/SettingContext";
import { WeekDay } from "@/models/data/setting/WeekDay";

const Component: NextPage = () => {
	const settingContext = useContext(SettingContext);

	const weeks: Array<WeekDay> = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	];
	const weekDisplay = new Map<WeekDay, string>([
		['sunday', '日曜日'],
		['monday', '月曜日'],
		['tuesday', '火曜日'],
		['wednesday', '水曜日'],
		['thursday', '木曜日'],
		['friday', '金曜日'],
		['saturday', '日曜日'],
	]);

	return (
		<>
			<section>
				<h2>曜日設定</h2>
				<ul>
					{weeks.map(a => {
						return (
							<li key={a}>
								<label>
									<input
										type='checkbox'
										defaultChecked={isRegularsHoliday(a, settingContext.calendar.holiday.regulars)}
										onChange={ev => {
											const ar = setRegularsHoliday(a, settingContext.calendar.holiday.regulars, ev.target.checked);
											settingContext.calendar.holiday.regulars = ar;
										}}
									/>
									{weekDisplay.get(a)}
								</label>
							</li>
						)
					})}
				</ul>
			</section>

			<section>
				<h2>祝日設定</h2>

				<section className="holiday">
				</section>
			</section>
		</>
	);
};

export default Component;

function isRegularsHoliday(week: WeekDay, weeks: ReadonlyArray<WeekDay>): boolean {
	return weeks.some(a => a === week);
}

function setRegularsHoliday(week: WeekDay, weeks: ReadonlyArray<WeekDay>, holiday: boolean): Array<WeekDay> {
	const index = weeks.indexOf(week);

	if (holiday) {
		if (index === -1) {
			return [...weeks, week];
		}
	} else {
		if (index !== -1) {
			const uniques = new Set(weeks);
			uniques.delete(week);

			return [...uniques.values()];
		}
	}

	return [...weeks];
}
