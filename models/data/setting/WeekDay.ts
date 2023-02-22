export type WeekDay =
	'monday'
	|
	'tuesday'
	|
	'wednesday'
	|
	'thursday'
	|
	'friday'
	|
	'saturday'
	|
	'sunday'
	;

export function getWeekDays(): Array<WeekDay> {
	return [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday',
	];
}
