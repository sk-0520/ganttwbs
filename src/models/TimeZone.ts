import { TimeSpan } from "./TimeSpan";

export class TimeZone {
	public constructor(
		/**
		 * UTC からの位置。
		 */
		public readonly offset: TimeSpan
	) {
	}

	public static get utc(): TimeZone {
		return new TimeZone(TimeSpan.zero);
	}

	public serialize(): string {
		const signs = 0 <= this.offset.ticks ? "+" : "-";
		const h = Math.abs(this.offset.hours).toString().padStart(2, "0");
		const m = Math.abs(this.offset.minutes).toString().padStart(2, "0");
		return `${signs}${h}:${m}`;
	}

	public static parse(s: string): TimeZone | null {
		const regex = /(?<signs>\+|-)(?<h>[0-2][0-9]):(?<m>[0-5][0-9])/;
		const match = s.match(regex);
		if (!match || !match.groups) {
			return null;
		}
		const signs = match.groups["signs"] === "-" ? -1 : +1;
		const h = Number.parseInt(match.groups["h"], 10);
		const m = Number.parseInt(match.groups["m"], 10);
		const totalMinutes = (h * 60 + m) * signs;

		return new TimeZone(TimeSpan.fromMinutes(totalMinutes));
	}

	/**
	 * クライアント(ブラウザ)のタイムゾーンを取得。
	 * @returns
	 */
	public static getClientTimeZone(): TimeZone {
		//return Intl.DateTimeFormat().resolvedOptions().timeZone;
		const date = new Date();
		const offset = date.getTimezoneOffset() * -1;

		return new TimeZone(TimeSpan.fromMinutes(offset));
	}
}
