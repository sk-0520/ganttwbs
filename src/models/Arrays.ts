
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
	 * @param toPrev 前(-1)に移動するか。
	 * @param element 対象要素。
	 * @returns 移動できたか。
	 */
	public static replaceOrderInPlace<T>(array: Array<T>, toPrev: boolean, element: T): boolean {
		const currentIndex = array.findIndex(a => a === element);
		if (currentIndex === -1) {
			return false;
		}

		if (toPrev) {
			if (currentIndex && array.length) {
				const nextIndex = currentIndex - 1;
				const tempElement = array[nextIndex];
				array[nextIndex] = element;
				array[currentIndex] = tempElement;
				return true;
			}
		} else {
			if (currentIndex < array.length - 1) {
				const nextIndex = currentIndex + 1;
				const tempElement = array[nextIndex];
				array[nextIndex] = element;
				array[currentIndex] = tempElement;
				return true;
			}
		}

		return false;
	}
}
