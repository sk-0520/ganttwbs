type InputType = string | undefined;

/**
 * 絶対に分かってる値を指定の型に変換する。
 *
 * * 環境変数等が入力対象
 * * 失敗時は死ぬ
 */
export abstract class As {

	public static integer(input: InputType): number {
		if (!input) {
			throw new Error();
		}

		const value = Number.parseInt(input);
		if (Number.isNaN(value)) {
			throw new Error(input);
		}

		return value;
	}

	public static float(input: InputType): number {
		if (!input) {
			throw new Error();
		}

		const value = Number.parseFloat(input);
		if (Number.isNaN(value)) {
			throw new Error(input);
		}

		return value;
	}
}
