import { As } from "@/models/As";
import { ParseResult, ResultFactory } from "@/models/data/Result";
import { DateTimeTicks } from "@/models/DateTime";
import { Strong } from "@/models/Types";

/** TimeSpan シリアル値。 数値処理する場合は `Number` を経由すること。 */
export type TimeSpanTicks = Strong<"TimeSpanTicks", number>;

type TimeSpanParseResult = ParseResult<TimeSpan, Error>;

function toTicks(arg: number | TimeSpanTicks): TimeSpanTicks {
	return arg as TimeSpanTicks;
}

/**
 * 時間を扱う。
 *
 * 細かいのは時間できたときに、うん。
 */
export class TimeSpan {

	/**
	 * 生成。
	 *
	 * @param _ticks ちっくたっく。
	 */
	private constructor(
		private readonly _ticks: TimeSpanTicks
	) {
	}

	//#region property

	private static _zero: TimeSpan | undefined = undefined;
	public static get zero(): TimeSpan {
		return this._zero ??= new TimeSpan(toTicks(0));
	}

	public get milliseconds(): number {
		return Number(this._ticks) % 1000;
	}

	public get seconds(): number {
		return Math.trunc((Number(this._ticks) / 1000) % 60);
	}

	public get minutes(): number {
		return Math.trunc((Number(this._ticks) / 1000 / 60) % 60);
	}

	public get hours(): number {
		return Math.trunc((Number(this._ticks) / 1000 / 60 / 60) % 24);
	}

	public get days(): number {
		return Math.trunc(Number(this._ticks) / 1000 / 60 / 60 / 24);
	}

	/**
	 * ミリ秒。
	 */
	public get ticks(): TimeSpanTicks {
		return this._ticks;
	}

	public get totalMilliseconds(): number {
		return Number(this._ticks);
	}

	public get totalSeconds(): number {
		return Number(this._ticks) / 1000;
	}

	public get totalMinutes(): number {
		return Number(this._ticks) / 1000 / 60;
	}

	public get totalHours(): number {
		return Number(this._ticks) / 1000 / 60 / 60;
	}

	public get totalDays(): number {
		return Number(this._ticks) / 1000 / 60 / 60 / 24;
	}

	//#endregion

	//#region function

	public static fromTicks(ticks: DateTimeTicks): TimeSpan {
		return this.fromMilliseconds(Number(ticks));
	}

	public static fromMilliseconds(milliSeconds: number): TimeSpan {
		return new TimeSpan(toTicks(milliSeconds));
	}

	public static fromSeconds(seconds: number): TimeSpan {
		return new TimeSpan(toTicks(seconds * 1000));
	}

	public static fromMinutes(minutes: number): TimeSpan {
		return new TimeSpan(toTicks(minutes * 60 * 1000));
	}

	public static fromHours(hours: number): TimeSpan {
		return new TimeSpan(toTicks(hours * 60 * 60 * 1000));
	}

	public static fromDays(hours: number): TimeSpan {
		return new TimeSpan(toTicks(hours * 24 * 60 * 60 * 1000));
	}

	public equals(timeSpan: TimeSpan): boolean {
		return this.ticks === timeSpan.ticks;
	}

	public compare(timeSpan: TimeSpan): number {
		return Number(this.ticks) - Number(timeSpan.ticks);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static parseIso8601(s: string): TimeSpanParseResult {
		//P[n]Y[n]M[n]DT[n]H[n]M[n]S
		const matches = /^P((?<YEAR>\d+)Y)?((?<MONTH>\d+)M)?((?<DAY>\d+)D)?(T((?<HOUR>\d+)H)?((?<MINUTE>\d+)M)?((?<SECOND>\d+)S)?(.(?<MS>\d+))?)?/.exec(s);
		if (!matches || !matches.groups) {
			return ResultFactory.error(new Error(s));
		}

		let rawTicks = 0;

		if (matches.groups.YEAR) {
			rawTicks += As.integer(matches.groups.YEAR) * 365 * 12 * 24 * 60 * 60 * 1000;
		}
		if (matches.groups.MONTH) {
			rawTicks += As.integer(matches.groups.MONTH) * 12 * 24 * 60 * 60 * 1000;
		}
		if (matches.groups.DAY) {
			rawTicks += As.integer(matches.groups.DAY) * 24 * 60 * 60 * 1000;
		}

		if (matches.groups.HOUR) {
			rawTicks += As.integer(matches.groups.HOUR) * 60 * 60 * 1000;
		}
		if (matches.groups.MINUTE) {
			rawTicks += As.integer(matches.groups.MINUTE) * 60 * 1000;
		}
		if (matches.groups.SECOND) {
			rawTicks += As.integer(matches.groups.SECOND) * 60 * 1000;
		}
		if (matches.groups.MS) {
			rawTicks += As.integer(matches.groups.MS);
		}

		return ResultFactory.success(new TimeSpan(toTicks(rawTicks)));
	}

	private static parseReadable(s: string): TimeSpanParseResult {
		const matches = /^((?<DAY>\d+)\.)?(?<H>\d+):(?<M>\d+):(?<S>\d+)(\.(?<MS>\d{1,3}))?$/.exec(s);
		if (!matches || !matches.groups) {
			return ResultFactory.error(new Error(s));
		}

		const totalSeconds
			= As.integer(matches.groups.S)
			+ (As.integer(matches.groups.M) * 60)
			+ (As.integer(matches.groups.H) * 60 * 60)
			+ (matches.groups.DAY ? As.integer(matches.groups.DAY) * 60 * 60 * 24 : 0);

		if (matches.groups.MS) {
			const ms = As.integer(matches.groups.MS);
			if (ms) {
				const totalMilliseconds = totalSeconds * 1000 + ms;
				return ResultFactory.success(TimeSpan.fromMilliseconds(totalMilliseconds));
			}
		}

		return ResultFactory.success(TimeSpan.fromSeconds(totalSeconds));
	}

	private static parseCore(s: string): TimeSpanParseResult {
		if (!s) {
			return ResultFactory.error(new Error());
		}

		if (s[0] === "P") {
			return TimeSpan.parseIso8601(s);
		}

		return TimeSpan.parseReadable(s);
	}

	public static tryParse(s: string): TimeSpan | null {
		return ResultFactory.parseErrorIsReturnNull(s, this.parseCore);
	}

	public static parse(s: string): TimeSpan {
		return ResultFactory.parseErrorIsThrow(s, this.parseCore);
	}

	private serializeIso8601(): string {
		if (!this.ticks) {
			return "P0D";
		}

		let result = "P";

		if (this.days) {
			result += `${this.days}D`;
		}

		if (this.hours || this.minutes || this.seconds || this.milliseconds) {
			result += "T";

			if (this.hours) {
				result += `${this.hours}H`;
			}
			if (this.minutes) {
				result += `${this.minutes}M`;
			}
			if (this.seconds) {
				result += `${this.seconds}M`;
			}
			if (this.milliseconds) {
				result += `.${this.milliseconds}`;
			}
		}

		return result;
	}

	private serializeReadable(): string {
		let result = "";
		if (this.days) {
			result += this.days + ".";
		}

		result += [
			this.hours.toString().padStart(2, "0"),
			this.minutes.toString().padStart(2, "0"),
			this.seconds.toString().padStart(2, "0"),
		].join(":");

		if (this.milliseconds) {
			result += "." + this.milliseconds.toString().padStart(3, "0");
		}

		return result;
	}

	public serialize(format: "iso8601" | "readable"): string {
		switch (format) {
			case "iso8601":
				return this.serializeIso8601();

			case "readable":
				return this.serializeReadable();

			default:
				throw new Error();
		}
	}

	public toString(): string {
		return this.serialize("readable");
	}

	//#endregion
}
