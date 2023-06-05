import { IteratorBase, Predicate } from "@/models/collections/Iterator";

export class WhereIterable<T> implements Iterable<T> {
	public constructor(
		private readonly iterable: Iterable<T>,
		private readonly predicate: Predicate<T>,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new WhereIterator(this.iterable[Symbol.iterator](), this.predicate);
	}

	//#endregion
}

class WhereIterator<T> extends IteratorBase<T> {
	public constructor(
		private readonly iterator: Iterator<T>,
		private readonly predicate: Predicate<T>,
	) {
		super();
	}

	//#region IteratorBase

	public next(): IteratorResult<T> {
		while (true) {
			const result = this.iterator.next();
			if (result.done) {
				return result;
			}

			if (this.predicate(result.value)) {
				return this.yield(result.value);
			}
		}
	}

	//#endregion
}
