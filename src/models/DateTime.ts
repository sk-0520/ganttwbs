import { cdate } from "cdate";

import { ParseResult, ResultFactory } from "@/models/data/Result";
import { Require } from "@/models/Require";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";
import { Strong } from "@/models/Types";

type DateTimeParseResult = ParseResult<DateTime, Error>;

export type Unit = "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
/** 曜日(0: 日曜日, 1: 月曜日, 6: 土曜日) */
export type WeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** DateTime シリアル値。 数値処理する場合は `Number` を経由すること。 */
export type DateTimeTicks = Strong<"DateTimeTicks", number>;

export const InvalidHtmlTime = "invalid";

function toTicks(arg: number | DateTimeTicks): DateTimeTicks {
	return arg as DateTimeTicks;
}

function factory(timeZone: TimeZone): cdate.cdate {
	let create = cdate;
	if (timeZone.hasName) {
		create = cdate().tz(timeZone.serialize()).cdateFn();
	} else if (timeZone.hasOffset) {
		create = cdate().utcOffset(timeZone.serialize()).cdateFn();
	}

	return create;
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
	public get month(): MonthNumber {
		const result = this.date.get("month") + 1;
		if (1 <= result && result <= 12) {
			return result as MonthNumber;
		}

		throw new Error();
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

	/** ミリ秒(0-999) */
	public get millisecond(): number {
		return this.date.get("millisecond");
	}

	/**
	 * UNIX時間のミリ秒取得。
	 * @returns
	 */
	public get ticks(): DateTimeTicks {
		return toTicks(Number(this.date));
	}

	public get timeIsEmpty(): boolean {
		return !this.hour
			&&
			!this.minute
			&&
			!this.second
			&&
			!this.millisecond
			;
	}

	//#endregion

	//#region function

	private static parseCore(input: string | Date | DateTimeTicks | undefined, timeZone: TimeZone): DateTimeParseResult {
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
	public static convert(input: Date | DateTimeTicks, timeZone: TimeZone): DateTime {
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

			// 実環境だと年/月指定がなんでか動かん 原因解明より動けばいい方針
			switch (unit) {
				case "month":
					return DateTime.create(
						this.timeZone,
						this.year,
						this.month + diff,
						this.day,
						this.hour,
						this.minute,
						this.second,
						this.millisecond,
					);

				case "year":
					return DateTime.create(
						this.timeZone,
						this.year + diff,
						this.month,
						this.day,
						this.hour,
						this.minute,
						this.second,
						this.millisecond,
					);

				default:
					date = this.date.add(diff, unit);
			}
		}

		return new DateTime(date, this.timeZone);
	}

	public changeTimeZone(timeZone: TimeZone): DateTime {
		const create = factory(timeZone);
		const date = create(Number(this.date));
		return new DateTime(date, timeZone);
	}

	/**
	 * ビルドイン `Date` への変換。
	 * @param keepLocalTime ローカル時間を保持するか。 内部事情をコメントにするなら Excel Book の日付とかで指定が必要。
	 * @returns ビルドイン `Date`。
	 */
	public toDate(keepLocalTime?: boolean): Date {
		if (keepLocalTime) {
			return new Date(Date.UTC(
				this.year,
				this.month - 1,
				this.day,
				this.hour,
				this.minute,
				this.second,
				this.millisecond
			));
		}

		return this.date.toDate();
	}

	/**
	 * 差分取得。
	 * @param target 差分対象。自身からこいつまでの差分が対象となる。
	 * @returns
	 */
	public diff(target: Readonly<DateTime>): TimeSpan {
		const time = Number(target.ticks) - Number(this.ticks);
		return TimeSpan.fromMilliseconds(time);
	}

	public equals(date: DateTime): boolean {
		return this.ticks === date.ticks;
	}

	public compare(date: DateTime): number {
		return Number(this.ticks) - Number(date.ticks);
	}

	/**
	 * 自身が指定日時の間に納まっているか。
	 * @param begin 開始。
	 * @param end 終了。
	 * @returns 納まっているか。
	 */
	public isIn(begin: DateTime, end: DateTime): boolean {
		return begin.ticks <= this.ticks && this.ticks <= end.ticks;
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

	/**
	 * 指定した単位未満を切り落とす。
	 * @param keepUnit 切り落とし時に保持する単位。ここで指定した値未満が初期値となる。
	 * @returns 切り落とされた項目は初期値(月なら1月、日なら1日、時なら0時)となる
	 */
	public truncate(keepUnit: Exclude<Unit, "millisecond">): DateTime {
		if (keepUnit as string === "millisecond") {
			throw new Error(keepUnit);
		}

		const date = Require.switch(keepUnit, {
			"year": _ => this.date.set("millisecond", 0).set("second", 0).set("minute", 0).set("hour", 0).set("date", 1).set("month", 0),
			"month": _ => this.date.set("millisecond", 0).set("second", 0).set("minute", 0).set("hour", 0).set("date", 1),
			"day": _ => this.date.set("millisecond", 0).set("second", 0).set("minute", 0).set("hour", 0),
			"hour": _ => this.date.set("millisecond", 0).set("second", 0).set("minute", 0),
			"minute": _ => this.date.set("millisecond", 0).set("second", 0),
			"second": _ => this.date.set("millisecond", 0),
		});

		return new DateTime(date, this.timeZone);
	}

	/**
	 * 自身から年月日以外を破棄。
	 * @returns
	 */
	public truncateTime(): DateTime {
		return this.truncate("day");
	}

	/**
	 * 指定した単位での終わりを指す日時を取得する。
	 * @param unit 年を指定した場合は自身の年の最終日、月を指定した場合は自身の月の最終日、秒を指定した場合は自身の秒の最終ミリ秒。
	 * @returns
	 */
	public endOf(unit: Exclude<Unit, "millisecond">): DateTime {
		const date = Require.switch(unit, {
			"year": _ => this.date.endOf("year"),
			"month": _ => this.date.endOf("month"),
			"day": _ => this.date.endOf("date"),
			"hour": _ => this.date.endOf("hour"),
			"minute": _ => this.date.endOf("minute"),
			"second": _ => this.date.endOf("second"),
		});

		return new DateTime(date, this.timeZone);
	}

	/**
	 * 自身の日付最終時間を取得。
	 * @returns
	 */
	public endOfTime(): DateTime {
		return this.endOf("day");
	}


	/**
	 * 自身の所属する月の最終日を取得。
	 * @returns
	 */
	public getLastDayOfMonth(): DateTime {
		const date = this.date
			.endOf("month")
			.endOf("day")
			;

		return new DateTime(date, this.timeZone);
	}

	/**
	 * フォーマット。
	 * @param format
	 *  * U: ISO8601
	 *  * L: ローカライズ
	 *  * `undefined`: Date.toISOString()
	 *  * その他 _.NET_ のやつで出来そうなのだけ
	 *    * `[[y]yy]yy`
	 *    * `[M]M`
	 *    * `[d]d`
	 *    * `[H]H`
	 *    * `[m]m`
	 *    * `[s]s`
	 *    * `[ff]f`
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
			["yy", padStart0(this.year % 100, 2)],
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

			["f", this.millisecond.toString()],
			["fff", padStart0(this.millisecond, 3)],
		]);

		const pattern = [...map.keys()]
			.sort((a, b) => b.length - a.length)
			.join("|")
			;

		return format.replace(
			new RegExp("(" + pattern + ")", "g"),
			m => map.get(m) ?? m
		);
	}

	/**
	 * HTML上での表現に変換。
	 * @param tag
	 * @returns
	 */
	public toHtml(tag: "time" | "input-date"): string {
		switch (tag) {
			case "time":
				return this.format("U");

			case "input-date":
				return this.format("yyyy-MM-dd");

			default:
				throw new Error(tag);
		}
	}

	public toString(): string {
		return this.format("U");
	}

	private static getMinMax(func: (...values: ReadonlyArray<number>) => number, a: DateTime, b: DateTime, ...dates: ReadonlyArray<DateTime>): DateTime {
		let rawTicks: number;

		if (dates.length) {
			rawTicks = func(...[
				Number(a.ticks),
				Number(b.ticks),
				...dates.map(i => Number(i.ticks))
			]);
		} else {
			rawTicks = func(
				Number(a.ticks),
				Number(b.ticks),
			);
		}

		return this.convert(toTicks(rawTicks), a.timeZone);
	}

	public static getMinimum(a: DateTime, b: DateTime, ...dates: ReadonlyArray<DateTime>): DateTime {
		return this.getMinMax(Math.min, a, b, ...dates);
	}

	public static getMaximum(a: DateTime, b: DateTime, ...dates: ReadonlyArray<DateTime>): DateTime {
		return this.getMinMax(Math.max, a, b, ...dates);
	}

	//#endregion
}
