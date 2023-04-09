import { Strings } from "./Strings";
import { TimeSpan } from "./TimeSpan";

export abstract class TimeZone {

	public static get utc(): TimeZone {
		return new OffsetTimeZone(TimeSpan.zero);
	}

	public abstract get hasOffset(): boolean;
	public abstract get hasName(): boolean;

	/**
	 * クライアント(ブラウザ)のタイムゾーンを取得。
	 * @returns
	 */
	public static getClientTimeZone(): TimeZone {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if(tz) {
			return new IanaTimeZone(tz);
		}

		//return Intl.DateTimeFormat().resolvedOptions().timeZone;
		const date = new Date();
		const offset = date.getTimezoneOffset() * -1;

		return new OffsetTimeZone(TimeSpan.fromMinutes(offset));
	}

	public static parse(s: string): TimeZone | null {
		if (s.includes("/")) {
			return new IanaTimeZone(s);
		}

		const regex = /(?<signs>\+|-)(?<h>[0-2][0-9]):(?<m>[0-5][0-9])/;
		const match = s.match(regex);
		if (!match || !match.groups) {
			return null;
		}
		const signs = match.groups["signs"] === "-" ? -1 : +1;
		const h = Number.parseInt(match.groups["h"], 10);
		const m = Number.parseInt(match.groups["m"], 10);
		const totalMinutes = (h * 60 + m) * signs;

		return new OffsetTimeZone(TimeSpan.fromMinutes(totalMinutes));
	}

	public static create(input: TimeSpan | string): TimeZone {
		if (input instanceof TimeSpan) {
			return new OffsetTimeZone(input);
		}
		if (Strings.isNotWhiteSpace(input)) {
			return new IanaTimeZone(input);
		}

		throw new Error(input);
	}

	public abstract serialize(): string;

}

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
