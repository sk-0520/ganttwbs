import { Strings } from "./Strings";
import { TimeSpan } from "./TimeSpan";
import { ParseResult, ResultFactory } from "./data/Result";

type TimeZoneParseResult = ParseResult<TimeZone, Error>;

/**
 * タイムゾーン。
 */
export abstract class TimeZone {

	/**
	 * UTCタイムゾーンの取得。
	 */
	public static get utc(): TimeZone {
		return new OffsetTimeZone(TimeSpan.zero);
		//return new IanaTimeZone("UTC");
	}

	/**
	 * オフセットを持つか。
	 */
	public abstract get hasOffset(): boolean;
	/**
	 * タイムゾーン名を持つか。
	 */
	public abstract get hasName(): boolean;

	/**
	 * クライアント(ブラウザ)のタイムゾーンを取得。
	 * @returns
	 */
	public static getClientTimeZone(): TimeZone {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (tz) {
			return new IanaTimeZone(tz);
		}

		const date = new Date();
		const offset = date.getTimezoneOffset() * -1;

		return new OffsetTimeZone(TimeSpan.fromMinutes(offset));
	}

	private static parseCore(s: string): TimeZoneParseResult {
		if (s.includes("/")) {
			return ResultFactory.success(new IanaTimeZone(s));
		}

		//TODO: +-HH:MM 形式のみ。 : なかったり、HHのみとかもうめんどい
		const regex = /(?<signs>\+|-)(?<h>[0-2][0-9]):(?<m>[0-5][0-9])/;
		const match = s.match(regex);
		if (!match || !match.groups) {
			return ResultFactory.error(new Error(s));
		}

		const signs = match.groups["signs"] === "-" ? -1 : +1;
		const h = Number.parseInt(match.groups["h"], 10);
		const m = Number.parseInt(match.groups["m"], 10);
		const totalMinutes = (h * 60 + m) * signs;

		return ResultFactory.success(new OffsetTimeZone(TimeSpan.fromMinutes(totalMinutes)));
	}

	/**
	 *
	 * @param s
	 * @returns パース成功時はタイムゾーン。失敗時は `null`。
	 */
	public static tryParse(s: string): TimeZone|null {
		return ResultFactory.parseErrorIsReturnNull(s, this.parseCore);
	}

	/**
	 * パース。
	 * @param s
	 * @returns パース成功時はタイムゾーン。失敗時は `null`。
	 */
	public static parse(s: string): TimeZone {
		return ResultFactory.parseErrorIsThrow(s, this.parseCore);
	}

	/**
	 * 生成。
	 * @param input
	 * @returns
	 */
	public static create(input: TimeSpan | string): TimeZone {
		if (input instanceof TimeSpan) {
			return new OffsetTimeZone(input);
		}
		if (Strings.isNotWhiteSpace(input)) {
			return new IanaTimeZone(input);
		}

		throw new Error(input);
	}

	/**
	 * 保存処理。
	 *
	 * @returns create で生成可能なものを返す。
	 */
	public abstract serialize(): string;

}

/**
 * オフセットタイムゾーン。
 */
class OffsetTimeZone extends TimeZone {
	private serialized?: string;

	public constructor(
		/**
		 * UTC からの位置。
		 */
		public readonly offset: TimeSpan
	) {
		super();
	}

	public get hasOffset(): boolean {
		return true;
	}

	public get hasName(): boolean {
		return false;
	}

	public override serialize(): string {
		if (!this.serialized) {
			const signs = 0 <= this.offset.ticks ? "+" : "-";
			const h = Math.abs(this.offset.hours).toString().padStart(2, "0");
			const m = Math.abs(this.offset.minutes).toString().padStart(2, "0");
			this.serialized = `${signs}${h}:${m}`;
		}

		return this.serialized;
	}
}

/**
 * 名称タイムゾーン。
 */
class IanaTimeZone extends TimeZone {
	public constructor(
		/**
		 * タイムゾーン名。
		 */
		public readonly name: string
	) {
		super();
	}

	public get hasOffset(): boolean {
		return false;
	}

	public get hasName(): boolean {
		return true;
	}

	public override serialize(): string {
		return this.name;
	}
}
