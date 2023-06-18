import { IteratorBase, Predicate } from "@/models/collections/Iterator";

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

export class TakeWhileIterable<T> implements Iterable<T> {
	public constructor(
		private readonly iterable: Iterable<T>,
		private readonly predicate: Predicate<T>,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new TakeWhileIterator(this.iterable[Symbol.iterator](), this.predicate);
	}

	//#endregion
}

class TakeWhileIterator<T> extends IteratorBase<T> {
	public constructor(
		private readonly iterator: Iterator<T>,
		private readonly predicate: Predicate<T>,
	) {
		super();
	}

	//#region property

	private took = false;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<T> {
		while (!this.took) {
			const result = this.iterator.next();
			if (result.done) {
				this.took = true;
				return result;
			}

			if(this.predicate(result.value)) {
				return result;
			}

			this.took = true;
			break;
		}

		return this.done();
	}

	//#endregion
}
