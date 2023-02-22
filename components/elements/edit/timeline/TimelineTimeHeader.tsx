import { EditContext } from '@/models/data/context/EditContext';
import { getWeekDays, toWeekDay } from '@/models/data/setting/WeekDay';
import { useLocale } from '@/models/locales/locale';
import { NextPage } from 'next';
import { useContext, useState } from 'react';

const Component: NextPage = () => {
	const locale = useLocale();
	const editContext = useContext(EditContext);

	const [rangeFrom] = useState(new Date(editContext.data.setting.calendar.range.from));
	const [rangeTo] = useState(new Date(editContext.data.setting.calendar.range.to));
	console.log(rangeFrom);
	console.log(rangeTo);

	var diff = rangeTo.getTime() - rangeFrom.getTime();
	const days = diff / (24 * 60 * 60 * 1000);

	const prev = {
		year: rangeTo.getFullYear(),
		month: rangeTo.getMonth(),
	}

	const dates = Array.from(Array(days), (_, index) => {
		const date = new Date(rangeFrom.getTime())
		date.setDate(date.getDate() + index);
		return date;
	});

	return (
		<div id='time-header'>
			<table>
				<tbody>
					<thead>
						<tr className='year-month'>
							{dates.map(i => {
								const year = i.getFullYear();
								const yearEquals = prev.year === year;
								prev.year = year;

								const month = i.getMonth();
								const monthEquals = prev.month === month;
								prev.month = month;

								return (
									<td className={'cell' + (yearEquals && monthEquals ? ' equals' : '')}>{year}/{i.getMonth() + 1}</td>
								);
							})}
						</tr>
					</thead>
					<tbody>
						<tr className='day'>
							{dates.map(i => <td className='cell'>{i.getDate()}</td>)}
						</tr>
						<tr className='week'>
							{dates.map(i => <td className='cell'>{locale.calendar.week.short[toWeekDay(i.getDay())]}</td>)}
						</tr>
					</tbody>
					<tbody>
						<tr className='pin'>
							{dates.map(i => <td className='cell'>@</td>)}
						</tr>
					</tbody>
				</tbody>
			</table>
		</div>
	);
};

export default Component;
