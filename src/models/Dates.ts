import { TimeSpan } from "./TimeSpan";

export abstract class Dates {

	/**
	 * 加算。
	 * @param date
	 * @param timeSpan
	 * @returns
	 */
	public static add(date: Date, timeSpan: TimeSpan): Date {
		const result = new Date(date.getTime());
		result.setMilliseconds(result.getMilliseconds() + timeSpan.totalMilliseconds);
		return result;
	}

	/**
	 * Date の差分を取得。
	 * @param base 基準
	 * @param target 差分対象
	 * @returns base - target の結果
	 */
	public static diff(base: Date, target: Date): TimeSpan {
		const time = base.getTime() - target.getTime();
		return TimeSpan.fromMilliseconds(time);
	}

	/**
	 * 文字列を `Date` に変換。
	 * @param input
	 * @returns 変換した `Date`、失敗時は `null`
	 */
	public static parseDate(input: string): Date | null {
		const date = new Date(input);

		if (Number.isNaN(date.getTime())) {
			return null;
		}

		return date;
	}

	/**
	 * フォーマット。
	 * @param date
	 * @param format
	 * @returns
	 */
	public static format(date: Date, format?: string): string {
		if (format === undefined) {
			return date.toISOString();
		}

		switch (format) {
			case "U":
				return date.toUTCString();

			case "S":
				return date.toString();

			case "L":
				return date.toLocaleString();

			default:
				break;
		}

		const map = new Map([
			["yyyy", date.getFullYear().toString().padStart(4, "0")],
			["yyyyy", date.getFullYear().toString().padStart(5, "0")],

			["M", (date.getMonth() + 1).toString()],
			["MM", (date.getMonth() + 1).toString().padStart(2, "0")],

			["d", date.getDate().toString()],
			["dd", date.getDate().toString().padStart(2, "0")],

			["H", date.getHours().toString()],
			["HH", date.getHours().toString().padStart(2, "0")],

			["m", date.getMinutes().toString()],
			["mm", date.getMinutes().toString().padStart(2, "0")],

			["s", date.getSeconds().toString()],
			["ss", date.getSeconds().toString().padStart(2, "0")],
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

}
