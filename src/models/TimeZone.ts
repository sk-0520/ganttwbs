import { Browsers } from "@/models/Browsers";
import { ParseResult, ResultFactory } from "@/models/data/Result";
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
		Browsers.enforceRunning();

		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (tz) {
			return new IanaTimeZone(tz);
		}

		const date = new Date();
		const offset = date.getTimezoneOffset() * -1;

		return new OffsetTimeZone(TimeSpan.fromMinutes(offset));
	}

	private static parseCore(s: string): TimeZoneParseResult {
		if (s.includes("/") || s === "UTC") {
			return ResultFactory.success(new IanaTimeZone(s));
		}

		//TODO: +-HH:MM 形式のみ。 : なかったり、HHのみとかもうめんどい
		const regex = /(?<SIGNS>\+|-)(?<H>[0-2][0-9]):(?<M>[0-5][0-9])/;
		const match = s.match(regex);
		if (!match || !match.groups) {
			return ResultFactory.error(new Error(s));
		}

		const signs = match.groups.SIGNS === "-" ? -1 : +1;
		const h = Number.parseInt(match.groups.H, 10);
		const m = Number.parseInt(match.groups.M, 10);
		const totalMinutes = (h * 60 + m) * signs;

		return ResultFactory.success(new OffsetTimeZone(TimeSpan.fromMinutes(totalMinutes)));
	}

	public static getTimeZones(): Array<TimeZone> {
		const baseTimeZoneNames = [
			"Africa/Cairo",
			"Africa/Johannesburg",
			"Africa/Nairobi",
			"America/Anchorage",
			"America/Bogota",
			"America/Buenos_Aires",
			"America/Caracas",
			"America/Chicago",
			"America/Denver",
			"America/El_Salvador",
			"America/Halifax",
			"America/Indianapolis",
			"America/Lima",
			"America/Los_Angeles",
			"America/Mexico_City",
			"America/New_York",
			"America/Panama",
			"America/Phoenix",
			"America/Puerto_Rico",
			"America/Santiago",
			"America/Sao_Paulo",
			"America/St_Johns",
			"America/Tijuana",
			"Antarctica/Casey",
			"Asia/Baghdad",
			"Asia/Bangkok",
			"Asia/Calcutta",
			"Asia/Colombo",
			"Asia/Dacca",
			"Asia/Dubai",
			"Asia/Hong_Kong",
			"Asia/Jakarta",
			"Asia/Jerusalem",
			"Asia/Kabul",
			"Asia/Kamchatka",
			"Asia/Karachi",
			"Asia/Katmandu",
			"Asia/Kuala_Lumpur",
			"Asia/Kuwait",
			"Asia/Manila",
			"Asia/Rangoon",
			"Asia/Riyadh",
			"Asia/Saigon",
			"Asia/Seoul",
			"Asia/Shanghai",
			"Asia/Singapore",
			"Asia/Taipei",
			"Asia/Tashkent",
			"Asia/Tbilisi",
			"Asia/Tehran",
			"Asia/Tokyo",
			"Asia/Yekaterinburg",
			"Atlantic/Bermuda",
			"Atlantic/Cape_Verde",
			"Atlantic/South_Georgia",
			"Australia/Lord_Howe",
			"Australia/NSW",
			"Australia/North",
			"Australia/Queensland",
			"Australia/South",
			"Europe/Amsterdam",
			"Europe/Athens",
			"Europe/Berlin",
			"Europe/Brussels",
			"Europe/Bucharest",
			"Europe/Dublin",
			"Europe/Helsinki",
			"Europe/Istanbul",
			"Europe/Lisbon",
			"Europe/London",
			"Europe/Minsk",
			"Europe/Moscow",
			"Europe/Paris",
			"Europe/Prague",
			"Europe/Rome",
			"Europe/Stockholm",
			"Pacific/Auckland",
			"Pacific/Chatham",
			"Pacific/Enderbury",
			"Pacific/Fiji",
			"Pacific/Guadalcanal",
			"Pacific/Honolulu",
			"Pacific/Kiritimati",
			"Pacific/Niue",
			"Pacific/Norfolk",
			"Pacific/Pago_Pago",
			"Pacific/Tongatapu",
		];

		const timeZoneNames = [
			...baseTimeZoneNames.sort(),
			"UTC",
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
	 * @returns
	 */
	public static create(offset: TimeSpan): TimeZone {
		return new OffsetTimeZone(offset);
	}

	/**
	 * 保存処理。
	 *
	 * @returns create で生成可能なものを返す。
	 */
	public abstract serialize(): string;

	public toString(): string {
		return this.serialize();
	}
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
