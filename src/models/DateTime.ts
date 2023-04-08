import { cdate } from "cdate";
import { TimeSpan } from "./TimeSpan";
import { TimeZone } from "./TimeZone";

/**
 * 日付のラッパー。
 *
 * Date なり依存ライブラリなり、とりあえずこれでラップしておく。
 * 気持ちタイムゾーンもできてると思ってるけど確証はない。
 */
export class DateTime {

	private constructor(
		private readonly date: cdate.CDate,
		public readonly timeZone: TimeZone
	) {
	}

	//#region property

	public get year(): number {
		return this.date.get("year");
	}

	public get month(): number {
		return this.date.get("month");
	}

	public get day(): number {
		return this.date.get("date");
	}

	public get week(): number {
		return this.date.get("day");
	}

	public get hour(): number {
		return this.date.get("hour");
	}

	public get minute(): number {
		return this.date.get("minute");
	}

	public get second(): number {
		return this.date.get("second");
	}

	//#endregion

	//#region property

	public static createToday(timeZone: TimeZone): DateTime {
		const date = cdate().utcOffset(timeZone.offset.totalMinutes);
		return new DateTime(date, timeZone);
	}

	private static _parse(input: string | Date | number, timeZone: TimeZone): DateTime {
		let date = cdate(input)
		if (!date.utcOffset()) {
			date = date.utcOffset(timeZone.offset.totalMinutes);
		}
		return new DateTime(date, timeZone);
	}

	public static parse(input: string, timeZone: TimeZone): DateTime {
		// const create = cdate().utcOffset(timeZone.offset.totalMinutes).cdateFn();
		// const date = create(input)
		// const date = cdate(input).utcOffset(timeZone.offset.totalMinutes);
		// return new DateTime(date, timeZone);
		return DateTime._parse(input, timeZone);
	}

	public static convert(input: Date | number, timeZone: TimeZone): DateTime {
		return DateTime._parse(input, timeZone);
	}

	public add(timeSpan: TimeSpan): DateTime {
		const date = this.date.add(timeSpan.totalMilliseconds, "milliseconds");
		date.utcOffset(this.timeZone.offset.totalMinutes);
		return new DateTime(date, this.timeZone);
	}

	public diff(target: DateTime): TimeSpan {
		const time = target.getTime() - this.getTime();
		return TimeSpan.fromMilliseconds(time);
	}

	public getTime(): number {
		return this.date.toDate().getTime();
	}

	/**
	 * フォーマット。
	 * @param date
	 * @returns
	 */
	public format(format?: "U" | "S" | "L" | "I" | string): string {
		if (format === undefined) {
			return this.date.toDate().toISOString();
		}

		switch (format) {
			case "U":
				return this.date.toDate().toUTCString();

			case "S":
				return this.date.toDate().toString();

			case "L":
				return this.date.toDate().toLocaleString();

			case "I":
				return this.date.toDate().toISOString();

			default:
				break;
		}

		const map = new Map([
			["yyyy", this.year.toString().padStart(4, "0")],
			["yyyyy", this.year.toString().padStart(5, "0")],

			["M", (this.month + 1).toString()],
			["MM", (this.month + 1).toString().padStart(2, "0")],

			["d", this.day.toString()],
			["dd", this.day.toString().padStart(2, "0")],

			["H", this.hour.toString()],
			["HH", this.hour.toString().padStart(2, "0")],

			["m", this.minute.toString()],
			["mm", this.minute.toString().padStart(2, "0")],

			["s", this.second.toString()],
			["ss", this.second.toString().padStart(2, "0")],
		]);

		const pattern = Array.from(map.keys())
			.sort((a, b) => b.length - a.length)
			.join("|")
			;

		return format.replace(
			new RegExp("(" + pattern + ")", "g"),
			m => map.get(m) ?? m
		);
	}

	//#endregion
}
