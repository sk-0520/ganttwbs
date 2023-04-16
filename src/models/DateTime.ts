import { cdate } from "cdate";

import { TimeSpan } from "./TimeSpan";
import { TimeZone } from "./TimeZone";

export type Unit = "second" | "minute" | "hour" | "day" | "month" | "year";

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

	/** 年 */
	public get year(): number {
		return this.date.get("year");
	}

	/** 月(1-12) */
	public get month(): number {
		return this.date.get("month") + 1;
	}

	/** 日 */
	public get day(): number {
		return this.date.get("date");
	}

	/** 曜日(0-6) */
	public get week(): number {
		return this.date.get("day");
	}

	/** 時(0-23) */
	public get hour(): number {
		return this.date.get("hour");
	}

	/** 分(0-59) */
	public get minute(): number {
		return this.date.get("minute");
	}

	/** 秒(0-59) */
	public get second(): number {
		return this.date.get("second");
	}

	/** ミリ秒 */
	public get millisecond(): number {
		return this.date.get("millisecond");
	}

	//#endregion

	//#region property

	private static _parse(input: string | Date | number | undefined, timeZone: TimeZone): DateTime {
		let create = cdate;
		if (timeZone.hasName) {
			create = cdate().tz(timeZone.serialize()).cdateFn();
		} else if (timeZone.hasOffset) {
			create = cdate().utcOffset(timeZone.serialize()).cdateFn();
		}

		const date = create(input);

		return new DateTime(date, timeZone);
	}

	/**
	 * 今日という日を大切に。
	 * @param timeZone
	 * @returns
	 */
	public static today(timeZone: TimeZone): DateTime {
		return this._parse(undefined, timeZone);
	}

	/**
	 * パース。
	 * @param input
	 * @param timeZone
	 * @returns
	 */
	public static parse(input: string, timeZone: TimeZone): DateTime {
		return DateTime._parse(input, timeZone);
	}

	/**
	 * 変換。
	 * @param input
	 * @param timeZone
	 * @returns
	 */
	public static convert(input: Date | number, timeZone: TimeZone): DateTime {
		return DateTime._parse(input, timeZone);
	}

	/**
	 * 時間追加。
	 * @param diff
	 * @returns
	 */
	public add(diff: TimeSpan): DateTime;

	/**
	 * 時間追加。
	 * @param diff
	 * @param unit
	 * @returns
	 */
	public add(diff: number, unit: Unit): DateTime;

	public add(diff: TimeSpan | number, unit?: Unit): DateTime {
		let date: cdate.CDate;
		if (diff instanceof TimeSpan) {
			if (typeof unit !== "undefined") {
				throw new TypeError();
			}
			date = this.date.add(diff.totalMilliseconds, "milliseconds");
		} else {
			if (typeof diff !== "number") {
				throw new TypeError();
			}
			if (typeof unit !== "string") {
				throw new TypeError();
			}

			date = this.date.add(diff, unit);
		}

		return new DateTime(date, this.timeZone);
	}

	/**
	 * 差分取得。
	 * @param target
	 * @returns
	 */
	public diff(target: DateTime): TimeSpan {
		const time = target.getTime() - this.getTime();
		return TimeSpan.fromMilliseconds(time);
	}

	/**
	 * UNIX時間のミリ秒取得。
	 * @returns
	 */
	public getTime(): number {
		return this.date.toDate().getTime();
	}

	/**
	 * フォーマット。
	 * @param date
	 * @returns
	 */
	public format(format?: "U" | "L" | string): string {
		if (format === undefined) {
			return this.date.toDate().toISOString();
		}

		switch (format) {
			case "U":
				return this.date.text();

			case "L":
				return this.date.toDate().toLocaleString();

			default:
				break;
		}

		const map = new Map([
			["yyyy", this.year.toString().padStart(4, "0")],
			["yyyyy", this.year.toString().padStart(5, "0")],

			["M", (this.month).toString()],
			["MM", (this.month).toString().padStart(2, "0")],

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
