import { AppendIterable } from "@/models/collections/Append";
import { EmptyIterable } from "@/models/collections/Empty";
import { Predicate } from "@/models/collections/Iterator";
import { RangeIterable } from "@/models/collections/Range";
import { RepeatIterable } from "@/models/collections/Repeat";
import { ReverseIterable } from "@/models/collections/Reverse";
import { SelectIterable } from "@/models/collections/Select";
import { SelectManyIterable } from "@/models/collections/SelectMany";
import { SkipIterable, SkipWhileIterable } from "@/models/collections/Skip";
import { TakeIterable, TakeWhileIterable } from "@/models/collections/Take";
import { WhereIterable } from "@/models/collections/Where";
import { Result, ResultFactory } from "@/models/data/Result";

export class Collection<T> implements Iterable<T> {

	private constructor(
		private readonly iterable: Iterable<T>
	) {
	}

	//#region property
	//#endregion

	//#region 生成

	/**
	 * 反復可能オブジェクトからコレクション生成。
	 * @param iterable 反復可能オブジェクト
	 * @returns
	 */
	public static from<TSource>(iterable: Iterable<TSource>): Collection<TSource> {
		return new Collection(iterable);
	}

	/**
	 * 指定した範囲内の整数からコレクション生成。
	 * @param start 開始。
	 * @param count 終了。
	 * @returns
	 */
	public static range(start: number, count: number): Collection<number> {
		return new Collection(new RangeIterable(start, count));
	}

	/**
	 * 繰り返されるコレクションの生成。
	 * @param value 値。
	 * @param count 件数。
	 * @returns
	 */
	public static repeat<T>(value: T, count: number): Collection<T> {
		return new Collection(new RepeatIterable(value, count));
	}

	/**
	 * 空のコレクションを生成。
	 * @returns
	 */
	public static empty<T>(): Collection<T> {
		return new Collection(new EmptyIterable());
	}

	//#endregion

	//#region 実体化

	/**
	 * 配列として実体化。
	 * @returns
	 */
	public toArray(): Array<T> {
		return [...this.iterable];
	}

	//#endregion

	//#region 遅延

	/**
	 * [遅延] フィルタリング。
	 * @param predicate
	 * @returns
	 */
	public where(predicate: (value: T) => boolean): Collection<T> {
		return new Collection(new WhereIterable(this.iterable, predicate));
	}

	/**
	 * [遅延] 射影。
	 * @param selector
	 * @returns
	 */
	public select<TResult>(selector: (value: T, index: number) => TResult): Collection<TResult> {
		return new Collection(new SelectIterable(this.iterable, selector));
	}

	/**
	 * [遅延] 射影-平坦化。
	 * TODO: TS定義がよろしくない。
	 * @param selector
	 * @returns
	 */
	public selectMany<TResult>(selector: (value: T, index: number) => TResult): Collection<TResult> {
		return new Collection(new SelectManyIterable(this.iterable as unknown as Iterable<Iterable<T>>, selector));
	}

	/**
	 * [遅延] 末尾に連結。
	 * @param iterable 連結する反復可能オブジェクト。
	 * @returns
	 */
	public concat(iterable: Iterable<T>): Collection<T> {
		const appendIterable = new AppendIterable<T>();
		appendIterable.append(this.iterable);
		appendIterable.append(iterable);

		return new Collection(appendIterable);
	}

	/**
	 * [遅延] 要素を先頭に挿入。
	 * @param element
	 * @returns
	 */
	public prepend(element: T): Collection<T> {
		const appendIterable = new AppendIterable<T>();
		appendIterable.append([element]);
		appendIterable.append(this.iterable);

		return new Collection(appendIterable);
	}

	/**
	 * [遅延] 要素を末尾に追加。
	 * @param element
	 * @returns
	 */
	public append(element: T): Collection<T> {
		const appendIterable = new AppendIterable<T>();
		appendIterable.append(this.iterable);
		appendIterable.append([element]);

		return new Collection(appendIterable);
	}

	/**
	 * [遅延] 先頭から指定数をバイパス。
	 * @param count
	 * @returns
	 */
	public skip(count: number): Collection<T> {
		return new Collection(new SkipIterable(this.iterable, count));
	}

	/**
	 * [即時] 先頭から条件を満たす限りバイパス。
	 * @param predicate
	 * @returns
	 */
	public skipWhile(predicate: Predicate<T>): Collection<T> {
		return new Collection(new SkipWhileIterable(this.iterable, predicate));
	}

	/**
	 * [即時] 先頭から指定された件数を返却。
	 * @param count
	 * @returns
	 */
	public take(count: number): Collection<T> {
		return new Collection(new TakeIterable(this.iterable, count));
	}

	/**
	 * [遅延] 先頭から条件を満たすデータを返却。
	 * @param predicate
	 * @returns
	 */
	public takeWhile(predicate: Predicate<T>): Collection<T> {
		return new Collection(new TakeWhileIterable(this.iterable, predicate));
	}

	/**
	 * [遅延] 反転。
	 * @returns
	 */
	public reverse(): Collection<T> {
		return new Collection(new ReverseIterable(this.iterable));
	}

	//#endregion

	//#region 即時

	/**
	 * [即時] 要素が含まれているか。
	 * @param predicate 条件。未指定時は要素が一つでも存在すれば真を返す。
	 * @returns
	 */
	public any(predicate?: Predicate<T>): boolean {
		if (predicate) {
			for (const value of this.iterable) {
				if (predicate(value)) {
					return true;
				}
			}

			return false;
		}

		for (const _ of this.iterable) {
			return true;
		}

		return false;
	}

	/**
	 * [即時] 全ての要素が条件を満たすか。
	 * @param predicate 条件。未指定時は真を返す。
	 * @returns
	 */
	public all(predicate?: Predicate<T>): boolean {
		if (predicate) {
			for (const value of this.iterable) {
				if (!predicate(value)) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * [即時] 件数を取得。
	 * @param predicate 条件。未指定時は全数を返す。
	 * @returns
	 */
	public count(predicate?: Predicate<T>): number {
		let count = 0;

		if (predicate) {
			for (const value of this.iterable) {
				if (predicate(value)) {
					count += 1;
				}
			}

			return count;
		}

		for (const _ of this.iterable) {
			count += 1;
		}

		return count;
	}

	public firstCore(predicate?: Predicate<T>): Result<T, RangeError> {
		if (predicate) {
			for (const value of this.iterable) {
				if (predicate(value)) {
					return ResultFactory.success(value);
				}
			}
		} else {
			for (const value of this.iterable) {
				return ResultFactory.success(value);
			}
		}

		return ResultFactory.failure(new RangeError());
	}

	/**
	 * [即時] 先頭要素を取得。
	 * @param predicate
	 * @returns
	 * @throws {RangeError} 要素なし。
	 */
	public first(predicate?: Predicate<T>): T {
		const result = this.firstCore(predicate);
		if (result.success) {
			return result.value;
		}

		throw result.error;
	}

	/**
	 * [即時] 先頭要素を取得、存在しない場合は `undefined` を返す。
	 * @param predicate
	 * @returns
	 */
	public firstOrUndefined(predicate?: Predicate<T>): T | undefined {
		const result = this.firstCore(predicate);
		if (result.success) {
			return result.value;
		}

		return undefined;
	}

	private lastCore(predicate?: Predicate<T>): Result<T, RangeError> {
		let isFound = false;
		let current!: T;

		if (predicate) {
			for (const value of this.iterable) {
				if (predicate(value)) {
					isFound = true;
					current = value;
				}
			}
		} else {
			for (const value of this.iterable) {
				isFound = true;
				current = value;
			}
		}

		if (isFound) {
			return ResultFactory.success(current);
		}

		return ResultFactory.failure(new RangeError());
	}

	/**
	 * [即時] 終端要素を取得。
	 * @param predicate
	 * @returns
	 * @throws {RangeError} 要素なし。
	 */
	public last(predicate?: Predicate<T>): T {
		const result = this.lastCore(predicate);
		if (result.success) {
			return result.value;
		}

		throw result.error;
	}

	/**
	 * [即時] 終端要素を取得、存在しない場合は `undefined` を返す。
	 * @param predicate
	 * @returns
	 */
	public lastOrUndefined(predicate?: Predicate<T>): T | undefined {
		const result = this.lastCore(predicate);
		if (result.success) {
			return result.value;
		}

		return undefined;
	}

	private singleCore(predicate?: Predicate<T>): Result<T, RangeError> {
		let isFound = false;
		let current!: T;

		if (predicate) {
			for (const value of this.iterable) {
				if (predicate(value)) {
					if (isFound) {
						throw new RangeError();
					}
					isFound = true;
					current = value;
				}
			}
		} else {
			for (const value of this.iterable) {
				if (isFound) {
					throw new RangeError();
				}
				isFound = true;
				current = value;

			}
		}

		if (isFound) {
			return ResultFactory.success(current);
		}

		return ResultFactory.failure(new RangeError());
	}

	public single(predicate?: Predicate<T>): T {
		const result = this.singleCore(predicate);
		if (result.success) {
			return result.value;
		}

		throw result.error;
	}

	public singleOrUndefined(predicate?: Predicate<T>): T | undefined {
		const result = this.singleCore(predicate);
		if (result.success) {
			return result.value;
		}

		return undefined;
	}

	//#endregion


	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return this.iterable[Symbol.iterator]();
	}

	//#endregion
}
