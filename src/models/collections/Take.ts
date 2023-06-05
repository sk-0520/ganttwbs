import { IteratorBase } from "@/models/collections/Iterator";

export class TakeIterable<T> implements Iterable<T> {
	public constructor(
		private readonly iterable: Iterable<T>,
		private readonly count: number,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new TakeIterator(this.iterable[Symbol.iterator](), this.count);
	}

	//#endregion
}

class TakeIterator<T> extends IteratorBase<T> {
	public constructor(
		private readonly iterator: Iterator<T>,
		private readonly count: number,
	) {
		super();
	}

	//#region property

	private takeCount = 0;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<T> {
		while (this.takeCount++ < this.count) {
			const result = this.iterator.next();
			return result;
		}

		return this.done();
	}

	//#endregion
}
