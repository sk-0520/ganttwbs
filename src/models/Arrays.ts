
export abstract class Arrays {

	/**
	 * 指定の値を繰り返した配列の生成。
	 * @param value 参照の場合、配列内全てが同じ参照となる。
	 * @param count
	 */
	public static repeat<T>(value: T, count: number): Array<T> {
		if (count <= 0) {
			throw new RangeError();
		}

		return Array(count).fill(value);
	}

	/**
	 * 指定した範囲の配列を作成
	 * @param start
	 * @param count
	 * @returns
	 */
	public static range(start: number, count: number): Array<number> {
		if (count <= 0) {
			throw new RangeError();
		}

		return Array.from(Array(count), (_, k) => k + start);
	}

}
