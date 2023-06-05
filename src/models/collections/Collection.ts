import { AppendIterable } from "@/models/collections/Append";
import { EmptyIterable } from "@/models/collections/Empty";
import { Predicate } from "@/models/collections/Iterator";
import { RangeIterable } from "@/models/collections/Range";
import { RepeatIterable } from "@/models/collections/Repeat";
import { SelectIterable } from "@/models/collections/Select";
import { SelectManyIterable } from "@/models/collections/SelectMany";
import { WhereIterable } from "@/models/collections/Where";

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

	public concat(iterable: Iterable<T>): Collection<T> {
		const appendIterable = new AppendIterable<T>();
		appendIterable.append(this.iterable);
		appendIterable.append(iterable);

		return new Collection(appendIterable);
	}

	public prepend(element: T): Collection<T> {
		const appendIterable = new AppendIterable<T>();
		appendIterable.append([element]);
		appendIterable.append(this.iterable);

		return new Collection(appendIterable);
	}

	public append(element: T): Collection<T> {
		const appendIterable = new AppendIterable<T>();
		appendIterable.append(this.iterable);
		appendIterable.append([element]);

		return new Collection(appendIterable);
	}

	//#endregion

	//#region 即時

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


	//#endregion


	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return this.iterable[Symbol.iterator]();
	}

	//#endregion
}
