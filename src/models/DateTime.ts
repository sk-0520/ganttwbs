import { cdate } from "cdate";

import { ParseResult, ResultFactory } from "@/models/data/Result";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";


type DateTimeParseResult = ParseResult<DateTime, Error>;

export type Unit = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
export type WeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function factory(timeZone: TimeZone): cdate.cdate {
	let create = cdate;
	if (timeZone.hasName) {
		create = cdate().tz(timeZone.serialize()).cdateFn();
	} else if (timeZone.hasOffset) {
		create = cdate().utcOffset(timeZone.serialize()).cdateFn();
	}

	return create;
}

function toDateOnly(date: cdate.CDate): cdate.CDate {
	return date
		.set("hour", 0)
		.set("minute", 0)
		.set("second", 0)
		.set("millisecond", 0)
		;
}

function padStart(value: number, length: number, fillString: string): string {
	return value.toString().padStart(length, fillString);
}

function padStart0(value: number, length: number): string {
	return padStart(value, length, "0");
}


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
	public get week(): WeekIndex {
		return this.date.get("day") as WeekIndex;
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

	/**
	 * UNIX時間のミリ秒取得。
	 * @returns
	 */
	public get ticks(): number {
		return Number(this.date);
	}

	//#endregion

	//#region function

	private static parseCore(input: string | Date | number | undefined, timeZone: TimeZone): DateTimeParseResult {
		const create = factory(timeZone);

		const date = create(input);
		const raw = date as object;
		if ("t" in raw && isNaN(raw["t"] as number)) {
			return ResultFactory.error(new Error(String(input)));
		}

		return ResultFactory.success(new DateTime(date, timeZone));
	}

	public static create(
		timeZone: TimeZone,
		year: number,
		month: number,
		day?: number,
		hour?: number,
		minute?: number,
		second?: number,
		millisecond?: number
	): DateTime {
		// 指定された各数値で new Date(y,m,d...) 的な事したかったけど分からんかった,
		// 自分でタイムゾーン計算したらライブラリの意味ない、、、とはいえこの手法もどうなんっていう

		const date = {
			year: padStart0(year, 4),
			month: padStart0(month, 2),
			day: padStart0(day ?? 1, 2),
			hour: padStart0(hour ?? 0, 2),
			minute: padStart0(minute ?? 0, 2),
			second: padStart0(second ?? 0, 2),
			millisecond: (millisecond ?? 0).toString(),
		};
		const iso8601WithoutTimezone = `${date.year}-${date.month}-${date.day}T${date.hour}:${date.minute}:${date.second}.${date.millisecond}`;

		return this.parse(iso8601WithoutTimezone, timeZone);
	}

	/**
	 * 今日という日を大切に。
	 * @param timeZone
	 * @returns
	 */
	public static today(timeZone: TimeZone): DateTime {
		const result = this.parseCore(undefined, timeZone);
		if (result.success) {
			return result.value;
		}

		throw new Error("こない");
	}

	/**
	 * パース。
	 * @param input
	 * @param timeZone
	 * @returns
	 */
	public static tryParse(input: string, timeZone: TimeZone): DateTime | null {
		return ResultFactory.parseErrorIsReturnNull(input, s => this.parseCore(s, timeZone));
	}

	/**
	 * パース。
	 * @param input
	 * @param timeZone
	 * @returns
	 */
	public static parse(input: string, timeZone: TimeZone): DateTime {
		return ResultFactory.parseErrorIsThrow(input, s => this.parseCore(s, timeZone));
	}

	/**
	 * 変換。
	 * @param input
	 * @param timeZone
	 * @returns
	 */
	public static convert(input: Date | number, timeZone: TimeZone): DateTime {
		return ResultFactory.parseErrorIsThrow("", _ => this.parseCore(input, timeZone));
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

	public changeTimeZone(timeZone: TimeZone): DateTime {
		const create = factory(timeZone);
		const date = create(Number(this.date));
		return new DateTime(date, timeZone);
	}

	/**
	 * 差分取得。
	 * @param target
	 * @returns
	 */
	public diff(target: Readonly<DateTime>): TimeSpan {
		const time = target.ticks - this.ticks;
		return TimeSpan.fromMilliseconds(time);
	}

	public equals(date: DateTime): boolean {
		return this.ticks === date.ticks;
	}

	public compare(date: DateTime): number {
		return this.ticks - date.ticks;
	}

	/**
	 * 閏年か。
	 *
	 * いるか？これ。
	 * @param year
	 * @returns
	 */
	public static isLeapYear(year: number): boolean {
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	}

	public toDateOnly(): DateTime {
		const date = toDateOnly(this.date);

		return new DateTime(date, this.timeZone);
	}

	public getLastDayOfMonth(): DateTime {
		return new DateTime(toDateOnly(this.date.endOf("month").endOf("day")), this.timeZone);
	}

	/**
	 * フォーマット。
	 * @param format
	 *  * U: ISO8601
	 *  * L: ローカライズ
	 *  * `undefined`: Date.toISOString()
	 *  * その他 _.NET_ のやつで出来そうなのだけ
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
			["yyyy", padStart0(this.year, 4)],
			["yyyyy", padStart0(this.year, 5)],

			["M", (this.month).toString()],
			["MM", padStart0(this.month, 2)],

			["d", this.day.toString()],
			["dd", padStart0(this.day, 2)],

			["H", this.hour.toString()],
			["HH", padStart0(this.hour, 2)],

			["m", this.minute.toString()],
			["mm", padStart0(this.minute, 2)],

			["s", this.second.toString()],
			["ss", padStart0(this.second, 2)],
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

	/**
	 * HTML <input type="*" /> に合わせた入力文字列へ変換。
	 * @param type
	 * @returns
	 */
	public toInput(type: "date"): string {
		switch (type) {
			case "date":
				return this.format("yyyy-MM-dd");

			default:
				throw new Error(type);
		}
	}

	public toString(): string {
		return this.format("U");
	}

	//#endregion
}
