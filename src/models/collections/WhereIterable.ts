import { IteratorBase } from "@/models/collections/Iterator";

export class WhereIterable<T> implements Iterable<T> {
	public constructor(
		private readonly iterable: Iterable<T>,
		private readonly predicate: (value: T) => boolean,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new WhereIterator(this.iterable, this.predicate);
	}

	//#endregion
}

class WhereIterator<T> extends IteratorBase<T> {
	public constructor(
		iterable: Iterable<T>,
		private readonly predicate: (value: T) => boolean,
	) {
		super();
		this.iterator = iterable[Symbol.iterator]();
	}

	//#region property

	private iterator: Iterator<T>;

	//#endregion

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
