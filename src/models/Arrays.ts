/**
 * 配列の処理ヘルパー。
 */
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
	 * とりあえず謎の配列を作成する。
	 * @param count 配列数。 0 個を許容。
	 * @returns なんかの配列。配列の値ではなく数を用いる想定。
	 */
	public static create(count: number): Array<never> {
		if (!count) {
			return [];
		}
		return this.repeat<never>(undefined as never, count);
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

	/**
	 * 最初の要素を取得。
	 * @param array
	 * @returns
	 * @throws {RangeError} なんもねぇ
	 */
	public static first<T>(array: ReadonlyArray<T>): T {
		if (!array.length) {
			throw new RangeError();
		}

		return array[0];
	}

	/**
	 * 最後の要素を取得。
	 * @param array
	 * @returns
	 * @throws {RangeError} なんもねぇ
	 */
	public static last<T>(array: ReadonlyArray<T>): T {
		if (!array.length) {
			throw new RangeError();
		}

		return array[array.length - 1];
	}

	/**
	 * `Array.find` の絶対取る版
	 * 取得した値が `undefined` の場合に例外を投げるため、値として有効な `undefined` が入らない個所で使用すること。
	 * @param array
	 * @param predicate
	 * @param thisArg
	 * @returns 値。
	 * @throws `undefined` の場合に `RangeError`
	 */
	public static find<T>(array: ReadonlyArray<T>, predicate: (value: T, index: number, obj: readonly T[]) => boolean, thisArg?: any): T { // eslint-disable-line @typescript-eslint/no-explicit-any
		const result = array.find(predicate, thisArg);
		if (result === undefined) {
			throw new RangeError("not found");
		}

		return result;
	}

	/**
	 * `Array.findLast` の絶対取る版
	 * 取得した値が `undefined` の場合に例外を投げるため、値として有効な `undefined` が入らない個所で使用すること。
	 * @param array
	 * @param predicate
	 * @param thisArg
	 * @returns 値。
	 * @throws `undefined` の場合に `RangeError`
	 */
	public static findLast<T>(array: ReadonlyArray<T>, predicate: (value: T, index: number, obj: readonly T[]) => boolean, thisArg?: any): T { // eslint-disable-line @typescript-eslint/no-explicit-any
		const result = array.findLast(predicate, thisArg);
		if (result === undefined) {
			throw new RangeError("not found");
		}

		return result;
	}

	/**
	 * 配列内位置を移動(破壊的)。
	 * @param array 対象配列。
	 * @param fromIndex 元の位置。
	 * @param toIndex 移動先の位置。
	 */
	public static moveIndexInPlace<T>(array: Array<T>, fromIndex: number, toIndex: number) {
		const sourceElement = array[fromIndex];
		array.splice(fromIndex, 1);
		array.splice(toIndex, 0, sourceElement);
		return array;
	}

	/**
	 * 配列内位置を置き換え(破壊的)。
	 * `sourceIndex` と `destinationIndex` が置き換わる。
	 * @param array 対象配列。
	 * @param sourceIndex 元の位置。
	 * @param destinationIndex 置き換え先の位置。
	 */
	public static replaceIndexInPlace<T>(array: Array<T>, sourceIndex: number, destinationIndex: number): Array<T> {
		if (sourceIndex === destinationIndex) {
			return array;
		}

		const sourceElement = array[sourceIndex];
		array[sourceIndex] = array[destinationIndex];
		array[destinationIndex] = sourceElement;
		return array;
	}

	/**
	 * 配列内の指定要素を前後に置き換え(破壊的)。
	 * @param array 対象配列。
	 * @param toNext 次(+1)に移動するか。
	 * @param element 対象要素。
	 * @returns 移動できたか。
	 */
	public static replaceOrderInPlace<T>(array: Array<T>, toNext: boolean, element: T): boolean {
		const sourceIndex = array.findIndex(a => a === element);
		if (sourceIndex === -1) {
			return false;
		}

		if (toNext) {
			if (sourceIndex < array.length - 1) {
				const destinationIndex = sourceIndex + 1;
				this.replaceIndexInPlace(array, sourceIndex, destinationIndex);
				return true;
			}
		} else {
			if (sourceIndex && array.length) {
				const destinationIndex = sourceIndex - 1;
				this.replaceIndexInPlace(array, sourceIndex, destinationIndex);
				return true;
			}
		}

		return false;
	}

	public static orderBy<T>(array: ReadonlyArray<T>, keySelector?: (a: T, b: T) => number): Array<T> {
		return [...array].sort(keySelector);
	}
}
