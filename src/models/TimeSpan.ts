import { ParseResult, ResultFactory } from "./data/Result";

type TimeSpanParseResult = ParseResult<TimeSpan, Error>;

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
	private constructor(private readonly _ticks: number) {
	}

	//#region property

	public static get zero(): TimeSpan {
		return new TimeSpan(0);
	}

	public get milliseconds(): number {
		return this._ticks % 1000;
	}

	public get seconds(): number {
		return Math.trunc((this._ticks / 1000) % 60);
	}

	public get minutes(): number {
		return Math.trunc((this._ticks / 1000 / 60) % 60);
	}

	public get hours(): number {
		return Math.trunc((this._ticks / 1000 / 60 / 60) % 24);
	}

	public get days(): number {
		return Math.trunc(this._ticks / 1000 / 60 / 60 / 24);
	}

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static parseISO8601(s: string): TimeSpanParseResult {
		return ResultFactory.error(new Error());
	}

	private static parseReadable(s: string): TimeSpanParseResult {
		const matches = /^((?<DAY>\d+)\.)?(?<H>\d+):(?<M>\d+):(?<S>\d+)(\.(?<MS>\d{1,3}))?$/.exec(s);
		if (!matches || !matches.groups) {
			return ResultFactory.error(new Error(s));
		}

		const totalSeconds
			= parseInt(matches.groups.S, 10)
			+ (parseInt(matches.groups.M, 10) * 60)
			+ (parseInt(matches.groups.H, 10) * 60 * 60)
			+ (matches.groups.DAY ? parseInt(matches.groups.DAY, 10) * 60 * 60 * 24 : 0);

		if (matches.groups.MS) {
			const ms = parseInt(matches.groups.MS, 10);
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
			return TimeSpan.parseISO8601(s);
		}

		return TimeSpan.parseReadable(s);
	}

	public static tryParse(s: string): TimeSpan | null {
		const result = TimeSpan.parseCore(s);

		if (!result.success) {
			return null;
		}

		return result.value;
	}

	public static parse(s: string): TimeSpan {
		const result = TimeSpan.parseCore(s);

		if (!result.success) {
			throw result.error;
		}

		return result.value;
	}

	private toReadableString(): string {
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

	public toString(format: "readable"): string {
		switch (format) {
			case "readable":
				return this.toReadableString();

			default:
				throw new Error();
		}
	}

	//#endregion
}
