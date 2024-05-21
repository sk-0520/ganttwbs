import { Types } from "@/models/Types";

type InputType = string | undefined;

/**
 * 絶対に分かってる値を指定の型に変換する。
 *
 * * 環境変数等が入力対象
 *   * ユーザー操作で変わらないHTML値とかも対象(変えられて死んでもそれは知らぬ存ぜぬ)
 * * 失敗時は死ぬ
 */
export abstract class Cast {

	/**
	 * 文字列への変換。
	 * @param input
	 * @returns
	 */
	public static string(input: InputType): string {
		if (Types.isUndefined(input)) {
			throw new Error();
		}

		return input;
	}

	/**
	 * 整数へ変換。
	 * @param input
	 * @returns
	 */
	public static integer(input: InputType): number {
		const value = Number.parseInt(this.string(input));
		if (Number.isNaN(value)) {
			throw new Error(input);
		}

		return value;
	}

	/**
	 * 浮動小数点へ変換。
	 * @param input
	 * @returns
	 */
	public static float(input: InputType): number {
		const value = Number.parseFloat(this.string(input));
		if (Number.isNaN(value)) {
			throw new Error(input);
		}

		return value;
	}
}
