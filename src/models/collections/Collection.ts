import { EmptyIterable } from "@/models/collections/EmptyIterable";
import { RangeIterable } from "@/models/collections/RangeIterable";
import { RepeatIterable } from "@/models/collections/RepeatIterable";
import { SelectIterable } from "@/models/collections/SelectIterable";
import { SelectManyIterable } from "@/models/collections/SelectManyIterable";
import { WhereIterable } from "@/models/collections/WhereIterable";

export class Collection<T> implements Iterable<T> {

	private constructor(
		private readonly iterable: Iterable<T>
	) {
	}

	//#region property
	//#endregion

	//#region 生成

	public static from<TSource>(iterable: Iterable<TSource>): Collection<TSource> {
		return new Collection(iterable);
	}

	public static range(start: number, count: number): Collection<number> {
		return new Collection(new RangeIterable(start, count));
	}

	public static repeat<T>(value: T, count: number): Collection<T> {
		return new Collection(new RepeatIterable(value, count));
	}

	public static empty<T>(): Collection<T> {
		return new Collection(new EmptyIterable());
	}

	//#endregion

	//#region 実体化

	public toArray(): Array<T> {
		return [...this.iterable];
	}

	//#endregion

	//#region 遅延

	public where(predicate: (value: T) => boolean): Collection<T> {
		return new Collection(new WhereIterable(this.iterable, predicate));
	}

	public select<TResult>(selector: (value: T, index: number) => TResult): Collection<TResult> {
		return new Collection(new SelectIterable(this.iterable, selector));
	}

	// 呼び方わからん
	public selectMany<TResult>(selector: (value: T, index: number) => TResult): Collection<TResult> {
		return new Collection(new SelectManyIterable(this.iterable as unknown as Iterable<Iterable<T>>, selector));
	}

	//#endregion

	//#region 即時
	//#endregion


	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return this.iterable[Symbol.iterator]();
	}

	//#endregion
}
