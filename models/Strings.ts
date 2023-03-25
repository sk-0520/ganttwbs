export class Strings {

	/**
	 * 非空文字列(ホワイトスペース構成は除く)か。
	 *
	 * @param s
	 * @returns
	 */
	public static isNotWhiteSpace(s: string | null | undefined): s is string {
		return typeof s === 'string' && this.trim(s).length !== 0;
	}

	/**
	 * トリムの未指定時の対象文字。
	 */
	private static readonly TrimCharacters: ReadonlySet<string> = new Set([
		"\u{0009}",
		"\u{000a}",
		"\u{000b}",
		"\u{000c}",
		"\u{000d}",
		"\u{0085}",
		"\u{00a0}",
		"\u{0020}",
		"\u{2000}",
		"\u{2001}",
		"\u{2002}",
		"\u{2003}",
		"\u{2004}",
		"\u{2005}",
		"\u{2006}",
		"\u{2007}",
		"\u{2008}",
		"\u{2009}",
		"\u{200A}",
		"\u{202F}",
		"\u{205F}",
		"\u{3000}",
	]);

	/**
	 * 先頭文字列のトリム処理。
	 * @param s
	 * @param characters
	 * @returns
	 */
	public static trimStart(s: string, characters: ReadonlySet<string> | null = null): string {
		characters ??= this.TrimCharacters;

		if (!characters.size) {
			return s;
		}

		for (let i = 0; i < s.length; i++) {
			if (characters.has(s[i])) {
				continue;
			}

			return s.substring(i);
		}

		return "";
	}

	/**
	 * 終端文字列のトリム処理。
	 * @param s
	 * @param characters
	 * @returns
	 */
	public static trimEnd(s: string, characters: ReadonlySet<string> | null = null): string {
		characters ??= this.TrimCharacters;

		if (!characters.size) {
			return s;
		}

		for (let i = 0; i < s.length; i++) {
			if (characters.has(s[s.length - i - 1])) {
				continue;
			}

			return s.substring(0, s.length - i);
		}

		return "";
	}

	/**
	 * 前後のトリム処理。
	 * @param s
	 * @param characters
	 * @returns
	 */
	public static trim(s: string, characters: ReadonlySet<string> | null = null): string {
		characters ??= this.TrimCharacters;

		if (!characters.size) {
			return s;
		}

		return this.trimEnd(this.trimStart(s, characters), characters);
	}

	private static readonly _escapeRegex = /[.*+?^${}()|[\]\\]/g;

	/**
	 * 正規表現エスケープ。
	 *
	 * @param source
	 * @returns
	 */
	public static escapeRegex(source: string): string {
		return source.replace(this._escapeRegex, "\\$&");
	}


	public static replaceAllImpl(source: string, searchValue: string | RegExp, replaceValue: string): string {
		if (searchValue instanceof RegExp) {
			const flags = searchValue.flags.includes("g")
				? searchValue.flags
				: searchValue.flags + "g"
				;
			return source.replace(new RegExp(searchValue.source, flags), replaceValue);
		}

		return source.replace(new RegExp(this.escapeRegex(searchValue), "g"), replaceValue);
	}

	public static replaceAll(source: string, searchValue: string | RegExp, replaceValue: string): string {
		if (!String.prototype.replaceAll) {
			return this.replaceAllImpl(source, searchValue, replaceValue);
		}

		return source.replaceAll(searchValue, replaceValue);
	}

	/**
	 * 改行分割。
	 * @param source
	 * @returns
	 */
	public static splitLines(source: string | null | undefined): Array<string> {
		if (!source) {
			return [];
		}

		return source.split(/\r\n|\n|\r/);
	}

	public static toBoolean(s: string | null | undefined): boolean {
		if (!s) {
			return false;
		}

		return s.toLowerCase() === "true";
	}

	public static formatDate(date: Date, format?: string): string {
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
