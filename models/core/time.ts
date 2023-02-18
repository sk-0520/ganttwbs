import * as number from './number';

/**
 * 時間を扱う。
 *
 * 細かいのは時間できたときに、うん。
 */
export class TimeSpan {

	/**
	 * 生成。
	 *
	 * @param _ticks ミリ秒。
	 */
	private constructor(private _ticks: number) {
	}

	//#region property

	public get ticks(): number {
		return this._ticks;
	}

	public get totalMilliseconds(): number {
		return this._ticks;
	}

	public get totalSeconds(): number {
		return this._ticks / 1000;
	}

	public get totalMinutes(): number {
		return this._ticks / 1000 / 60;
	}

	public get totalHours(): number {
		return this._ticks / 1000 / 60 / 60;
	}

	public get totalDays(): number {
		return this._ticks / 1000 / 60 / 60 / 24;
	}

	//#endregion

	//#region function

	public static fromMilliseconds(milliSeconds: number): TimeSpan {
		return new TimeSpan(milliSeconds);
	}

	public static fromSeconds(seconds: number): TimeSpan {
		return new TimeSpan(seconds * 1000);
	}

	public static fromMinutes(minutes: number): TimeSpan {
		return new TimeSpan(minutes * 60 * 1000);
	}

	public static fromHours(hours: number): TimeSpan {
		return new TimeSpan(hours * 60 * 60 * 1000);
	}

	public static fromDays(hours: number): TimeSpan {
		return new TimeSpan(hours * 24 * 60 * 60 * 1000);
	}

	public equals(timeSpan: TimeSpan): boolean {
		return this.ticks === timeSpan.ticks;
	}

	public compare(timeSpan: TimeSpan): number {
		return this.ticks - timeSpan.ticks;
	}

	//#endregion
}

export enum DayOfWeek {
	Sunday = 0,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
}

/**
 * UTC周り多分間違ってる。
 */
export class DateTime {

	/**
	 * 生成。
	 *
	 * @param _timestamp タイムスタンプ。
	 */
	private constructor(private readonly _timestamp: Date, private readonly _isUtc: boolean) {
	}

	//#region property

	public get isUtc(): boolean {
		return this._isUtc;
	}

	public get year(): number {
		return this.isUtc
			? this._timestamp.getUTCFullYear()
			: this._timestamp.getFullYear()
			;
	}

	public get month(): number {
		const month = this.isUtc
			? this._timestamp.getUTCMonth()
			: this._timestamp.getMonth()
			;
		return month + 1;
	}

	public get day(): number {
		return this.isUtc
			? this._timestamp.getUTCDate()
			: this._timestamp.getDate()
			;
	}

	public get dayOfWeek(): DayOfWeek {
		return this.isUtc
			? this._timestamp.getUTCDay()
			: this._timestamp.getDay()
			;
	}

	public get hour(): number {
		return this.isUtc
			? this._timestamp.getUTCHours()
			: this._timestamp.getHours()
			;
	}

	public get minute(): number {
		return this.isUtc
			? this._timestamp.getUTCMinutes()
			: this._timestamp.getMinutes()
			;
	}

	public get second(): number {
		return this.isUtc
			? this._timestamp.getUTCSeconds()
			: this._timestamp.getSeconds()
			;
	}

	public get millisecond(): number {
		return this.isUtc
			? this._timestamp.getUTCMilliseconds()
			: this._timestamp.getMilliseconds()
			;
	}

	//#endregion

	//#region function

	public static now(): DateTime {
		return new DateTime(new Date(), false);
	}

	public static utcNow(): DateTime {
		const now = new Date();
		const utc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
		return new DateTime(new Date(utc), true);
	}

	private static createCore(isUtc: boolean, year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateTime {
		let date: Date | null = null;
		if (hour === undefined) {
			date = isUtc
				? new Date(Date.UTC(year, month - 1, day))
				: new Date(year, month - 1, day)
				;
		} else if (minute === undefined) {
			date = isUtc
				? new Date(Date.UTC(year, month - 1, day, hour))
				: new Date(year, month - 1, day, hour)
				;
		} else if (second === undefined) {
			date = isUtc
				? new Date(Date.UTC(year, month - 1, day, hour, minute))
				: new Date(year, month - 1, day, hour, minute);
		} else if (millisecond === undefined) {
			date = isUtc
				? new Date(Date.UTC(year, month - 1, day, hour, minute, second))
				: new Date(year, month - 1, day, hour, minute, second)
				;
		} else {
			date = isUtc
				? new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond))
				: new Date(year, month - 1, day, hour, minute, second, millisecond)
				;
		}
		return new DateTime(date, isUtc);
	}

	//#region create

	public static create(year: number, month: number, day: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number, minute: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number, minute: number, second: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number): DateTime;
	public static create(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateTime {
		return this.createCore(false, year, month, day, hour, minute, second, millisecond);
	}
	//#endregion

	//#region createUtc
	public static createUtc(year: number, month: number, day: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number, minute: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number, minute: number, second: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateTime {
		return this.createCore(true, year, month, day, hour, minute, second, millisecond);
	}
	//#endregion

	public static parse(timestamp: string): DateTime | null {
		const date = new Date(timestamp);
		if (Number.isNaN(date.getDate())) {
			return null;
		}

		return new DateTime(date, false);
	}

	public add(timeSpan: TimeSpan): DateTime {
		const current = this._timestamp.getTime();
		const addTime = new Date(current + timeSpan.ticks);
		return new DateTime(addTime, this.isUtc);
	}

	public equals(dateTime: DateTime): boolean {
		return this._timestamp.getTime() === dateTime._timestamp.getTime();
	}

	public compare(dateTime: DateTime): number {
		return this._timestamp.getTime() - dateTime._timestamp.getTime();
	}

	public toString(format?: string): string {
		if (format === undefined) {
			return this._timestamp.toISOString();
		}

		switch (format) {
			case 'U':
				return this._timestamp.toUTCString();

			case 'S':
				return this._timestamp.toString();

			case 'L':
				return this._timestamp.toLocaleString();

			default:
				break;
		}

		const map = new Map([
			//['y', (this.year.toString())],
			//['yy', number.padding(this.year - 2000, 2, '0')],
			//['yyy', number.padding(this.year, 3, '0')],
			['yyyy', number.padding(this.year, 4, '0')],
			['yyyyy', number.padding(this.year, 5, '0')],


			['M', this.month.toString()],
			['MM', number.padding(this.month, 2, '0')],

			['d', this.day.toString()],
			['dd', number.padding(this.day, 2, '0')],

			['H', this.hour.toString()],
			['HH', number.padding(this.hour, 2, '0')],

			['m', this.minute.toString()],
			['mm', number.padding(this.minute, 2, '0')],

			['s', this.second.toString()],
			['ss', number.padding(this.second, 2, '0')],
		]);

		const pattern = Array.from(map.keys())
			.sort((a, b) => b.length - a.length)
			.join('|')
			;

		return format.replace(
			new RegExp('(' + pattern + ')', 'g'),
			m => map.get(m) ?? m
		);
	}

	//#endregion
}

