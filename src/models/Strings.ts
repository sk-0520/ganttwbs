export abstract class Strings {

	/**
	 * 非空文字列(ホワイトスペース構成は除く)か。
	 *
	 * @param s
	 * @returns
	 */
	public static isNotWhiteSpace(s: string | null | undefined): s is string {
		return typeof s === "string" && this.trim(s).length !== 0;
	}

	/**
	 * 指定値を集合から一意な値に変換。
	 * @param source 指定値。
	 * @param items 重複チェック用の集合。
	 * @param compare 比較処理。
	 * @param converter 一意な値への変換処理。
	 * @returns 一意な値。
	 */
	public static toUnique(source: string, items: ReadonlySet<string>, compare: (a: string, b: string) => boolean, converter: (source: string, number: number) => string): string {
		let changeName = source;

		let n = 1;

		RETRY:
		while(true) {
			for (const value of items) {
				if (compare(value, changeName)) {
					changeName = converter(source, ++n);
					continue RETRY;
				}
			}

			break;
		}

		return changeName;
	}

	/**
	 * 指定値を集合から一意な値に変換(デフォルト処理)。
	 * @param source 指定値。
	 * @param items 重複チェック用の集合。
	 * @returns 一意な値。
	 */
	public static toUniqueDefault(source: string, items: ReadonlySet<string>): string {
		return this.toUnique(source, items, (a, b) => a === b, (source, number) => `${source}(${number})`);
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
	public static trimStart(s: string, characters?: ReadonlySet<string>): string {
		const chars = characters ?? this.TrimCharacters;

		if (!chars.size) {
			return s;
		}

		for (let i = 0; i < s.length; i++) {
			if (chars.has(s[i])) {
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
	public static trimEnd(s: string, characters?: ReadonlySet<string>): string {
		const chars = characters ?? this.TrimCharacters;

		if (!chars.size) {
			return s;
		}

		for (let i = 0; i < s.length; i++) {
			if (chars.has(s[s.length - i - 1])) {
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
	public static trim(s: string, characters?: ReadonlySet<string>): string {
		const chars = characters ?? this.TrimCharacters;

		if (!chars.size) {
			return s;
		}

		return this.trimEnd(this.trimStart(s, chars), chars);
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
	 * 関数によるプレースホルダー文字列置き換え。
	 * @param source 元文字列。
	 * @param head プレースホルダー開始。
	 * @param tail プレースホルダー終了。
	 * @param func プレースホルダー置き換え処理。
	 * @returns 置き換え文字列。
	 */
	public static replaceFunc(source: string, head: string, tail: string, func: (placeholder: string) => string): string {
		if (!head || !tail) {
			throw new Error(`head: ${head}, tail: ${tail}`);
		}
		if (!source) {
			return "";
		}

		const escHead = this.escapeRegex(head);
		const escTail = this.escapeRegex(tail);
		const pattern = escHead + "(.+?)" + escTail;

		const regex = new RegExp(pattern, "g");
		const replacedText = source.replace(regex, (s, m) => func(m));

		return replacedText;
	}

	/**
	 * ペアによるプレースホルダー文字列置き換え。
	 * @param source 元文字列。
	 * @param map キー:値 の集合。
	 * @param head プレースホルダー開始。
	 * @param tail プレースホルダー終了。
	 * @returns
	 */
	public static replaceMap(source: string, map: ReadonlyMap<string, string> | Record<string, string>, head = "${", tail = "}"): string {

		let func: (placeholder: string) => string;
		if (map instanceof Map) {
			func = (placeholder: string): string => {
				return map.get(placeholder) ?? placeholder;
			};
		} else {
			func = (placeholder: string): string => {
				return placeholder in map ? (map as Record<string, string>)[placeholder] : placeholder;
			};
		}

		return this.replaceFunc(source, head, tail, func);
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

}
