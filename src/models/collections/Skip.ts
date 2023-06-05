import { IteratorBase } from "@/models/collections/Iterator";

export class SkipIterable<T> implements Iterable<T> {
	public constructor(
		private readonly iterable: Iterable<T>,
		private readonly count: number,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new SkipIterator(this.iterable[Symbol.iterator](), this.count);
	}

	//#endregion
}

class SkipIterator<T> extends IteratorBase<T> {
	public constructor(
		private readonly iterator: Iterator<T>,
		private readonly count: number,
	) {
		super();
	}

	//#region property

	private skipCount = 0;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<T> {
		while (this.skipCount < this.count) {
			const result = this.iterator.next();
			if (result.done) {
				return result;
			}

			if (++this.skipCount <= this.count) {
				continue;
			}

			return this.yield(result.value);
		}

		return this.iterator.next();
	}

	//#endregion
}
