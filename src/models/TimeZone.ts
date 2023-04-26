import { ParseResult, ResultFactory } from "@/models/data/Result";
import { Strings } from "@/models/Strings";
import { TimeSpan } from "@/models/TimeSpan";

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

	public static getTimeZones(): Array<TimeZone> {
		const baseTimeZoneNames = [
			"Pacific/Kiritimati",
			"Pacific/Enderbury",
			"Pacific/Tongatapu",
			"Pacific/Chatham",
			"Asia/Kamchatka",
			"Pacific/Auckland",
			"Pacific/Fiji",
			"Pacific/Norfolk",
			"Pacific/Guadalcanal",
			"Australia/Lord_Howe",
			"Australia/Queensland",
			"Australia/NSW",
			"Australia/South",
			"Australia/North",
			"Asia/Seoul",
			"Asia/Tokyo",
			"Asia/Hong_Kong",
			"Asia/Kuala_Lumpur",
			"Asia/Manila",
			"Asia/Shanghai",
			"Asia/Singapore",
			"Asia/Taipei",
			"Antarctica/Casey",
			"Asia/Bangkok",
			"Asia/Jakarta",
			"Asia/Saigon",
			"Asia/Rangoon",
			"Asia/Dacca",
			"Asia/Katmandu",
			"Asia/Calcutta",
			"Asia/Colombo",
			"Asia/Karachi",
			"Asia/Tashkent",
			"Asia/Yekaterinburg",
			"Asia/Kabul",
			"Asia/Dubai",
			"Asia/Tbilisi",
			"Asia/Tehran",
			"Africa/Nairobi",
			"Asia/Baghdad",
			"Asia/Kuwait",
			"Asia/Riyadh",
			"Europe/Moscow",
			"Africa/Cairo",
			"Africa/Johannesburg",
			"Asia/Jerusalem",
			"Europe/Athens",
			"Europe/Bucharest",
			"Europe/Helsinki",
			"Europe/Istanbul",
			"Europe/Minsk",
			"Europe/Amsterdam",
			"Europe/Stockholm",
			"Europe/Berlin",
			"Europe/Brussels",
			"Europe/Paris",
			"Europe/Prague",
			"Europe/Rome",
			"Europe/Dublin",
			"Europe/Lisbon",
			"Europe/London",
			"Atlantic/Cape_Verde",
			"Atlantic/South_Georgia",
			"America/Buenos_Aires",
			"America/Sao_Paulo",
			"America/St_Johns",
			"America/Halifax",
			"America/Puerto_Rico",
			"America/Santiago",
			"Atlantic/Bermuda",
			"America/Caracas",
			"America/Bogota",
			"America/Indianapolis",
			"America/Lima",
			"America/New_York",
			"America/Panama",
			"America/Chicago",
			"America/El_Salvador",
			"America/Mexico_City",
			"America/Denver",
			"America/Phoenix",
			"America/Los_Angeles",
			"America/Tijuana",
			"America/Anchorage",
			"Pacific/Honolulu",
			"Pacific/Niue",
			"Pacific/Pago_Pago",
		];

		const timeZoneNames = [
			...baseTimeZoneNames.sort(),
			//"UTC",
		];

		return timeZoneNames.map(a => new IanaTimeZone(a));
	}

	/**
	 *
	 * @param s
	 * @returns パース成功時はタイムゾーン。失敗時は `null`。
	 */
	public static tryParse(s: string): TimeZone | null {
		return ResultFactory.parseErrorIsReturnNull(s, this.parseCore);
	}

	/**
	 * パース。
	 * @param s
	 * @returns パース成功時はタイムゾーン。
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
