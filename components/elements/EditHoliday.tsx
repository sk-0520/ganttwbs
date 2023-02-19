import { NextPage } from "next";
import { useContext, useState } from "react";
//import { useForm } from "react-hook-form";
import { EditContext } from '@/models/data/context/EditContext';
import { HolidayKind, HolidayEvent } from '@/models/data/setting/Holiday';
import * as ISO8601 from '@/models/data/setting/ISO8601';
import { useForm } from "react-hook-form";

interface Props {
	kind: HolidayKind
}

interface HolidayInput {
	date: ISO8601.Date;
	display: string;
}

const Component: NextPage<Props> = (props: Props) => {
	const editContext = useContext(EditContext);
	const { register } = useForm<HolidayInput>();

	const filteredHolidays = new Map<ISO8601.Date, string>();
	for (const [key, value] of Object.entries(editContext.data.setting.calendar.holiday.events)) {
		if (value.kind !== props.kind) {
			continue;
		}
		filteredHolidays.set(key, value.display);
	}
	const holidays = [...filteredHolidays]
		.map<HolidayInput>(a => ({ date: a[0], display: a[1] }))
		.sort((a, b) => a.date.localeCompare(b.date))
		.map((a, i) => ({ ...a, key: i }))
		;


	const [editableHolidays, setEditableHolidays] = useState(holidays);
	const [addHolidayDate, setAddHolidayDate] = useState('');
	const [addHolidayDisplay, setAddHolidayDisplay] = useState('');

	function handleAdd() {
		const item: HolidayInput & { key: number } = {
			key: editableHolidays.length + 1,
			date: addHolidayDate.trim(),
			display: addHolidayDisplay.trim(),
		};
		if (!item.date || !item.display) {
			return;
		}

		alert(JSON.stringify(item))

		editableHolidays.push(item);

		setAddHolidayDate('');
		setAddHolidayDisplay('');
	}

	return (
		<table className={props.kind}>
			<caption>{props.kind === 'holiday' ? '通常' : '特別'}</caption>
			<thead>
				<tr>
					<th>日付</th>
					<th>祝日名</th>
					<th>action</th>
				</tr>
			</thead>
			<tbody>
				{
					editableHolidays.map(a => (
						<tr key={a.key}>
							<td>
								<input
									type='date'
									defaultValue={a.date}
									{...register('date', {
										onChange: ev => {
											a.date = ev.target.value
										}
									})}
								/>
							</td>
							<td>
								<input type='text'
									defaultValue={a.display}
									{...register('display', {
										onChange: ev => {
											a.display = ev.target.value
										}
									})}
								/>
							</td>
							<td><button>remove</button></td>
						</tr>
					))
				}
			</tbody>
			<tfoot>
				<tr>
					<td>
						<input
							type='date'
							value={addHolidayDate}
							{...register('date', {
								onChange: ev => setAddHolidayDate(ev.target.value)
							})}
						/>
					</td>
					<td>
						<input type='text'
							value={addHolidayDisplay}
							{...register('display', {
								onChange: ev => setAddHolidayDisplay(ev.target.value)
							})}
						/>
					</td>
					<td><button type="button" onClick={handleAdd}>add</button></td>
				</tr>
			</tfoot>
		</table>
	);
};

export default Component;
