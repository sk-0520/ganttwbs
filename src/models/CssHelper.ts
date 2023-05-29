import { Strings } from "@/models/Strings";

export abstract class CssHelper {

	/**
	 * CSS 定義としてのクラス名に変換。
	 * @param s
	 * @returns
	 */
	public static toStyleClassName(s: string): string {
		return "." + s;
	}

	/**
	 * クラス名一覧を `<element class="*" />` に設定可能なクラス名に変更。
	 * @param classNames
	 * @returns
	 */
	public static joinClassName(classNames: ReadonlyArray<string>): string {
		return classNames
			.map(a => Strings.trim(a))
			.join(" ")
			;
	}

	/**
	 * CSS: `font-family` に設定可能な値に変更。
	 * @param families
	 * @returns
	 */
	public static toFontFamily(families: ReadonlyArray<string>): string {
		return families
			.map(a => Strings.trim(a))
			.map(a => a.includes(" ") ? `'${a}'` : a)
			.join(",")
			;
	}

}
