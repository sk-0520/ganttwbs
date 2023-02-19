import { NextPage } from "next";
import { useContext } from "react";
//import { useForm } from "react-hook-form";
import { EditContext } from "@/models/data/context/EditContext";
import { WeekDay } from "@/models/data/setting/WeekDay";
import EditHoliday from "./EditHoliday";

const Component: NextPage = () => {
	const editContext = useContext(EditContext);
	//const { register } = useForm<EditContext>();

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
										defaultChecked={isRegularsHoliday(a, editContext.data.setting.calendar.holiday.regulars)}
										onChange={ev => {
											const ar = setRegularsHoliday(a, editContext.data.setting.calendar.holiday.regulars, ev.target.checked);
											editContext.data.setting.calendar.holiday.regulars = ar;
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
					<EditHoliday kind="holiday" />
					<EditHoliday kind="special" />
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
