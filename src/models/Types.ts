export abstract class Types {

	/**
	 * 型が `undefined` か。
	 * @param arg
	 * @returns
	 */
	public static isUndefined(arg: unknown): arg is undefined {
		return typeof arg === "undefined";
	}
	/**
	 * 型が `null` か。
	 * @param arg
	 * @returns
	 */
	public static isNull(arg: unknown): arg is null {
		return arg === null;
	}

	/**
	 * 型が `undefined | null` か。
	 * @param arg
	 */
	public static isNullish(arg: unknown): arg is null | undefined {
		return this.isUndefined(arg) || this.isNull(arg);
	}

	public static isString(arg: unknown): arg is string {
		return typeof arg === "string";
	}

	/**
	 * 真偽値変換。
	 * ちょっとお堅いJSX内で使用する想定。
	 * `!!` はなんかこう、使いたくない。
	 * @param arg 対象データ。
	 * @returns
	 */
	public static toBoolean(arg: unknown): boolean {
		return arg ? true : false;
	}
}
