import { IteratorBase } from "@/models/collections/Iterator";

export class ReverseIterable<T> implements Iterable<T> {
	public constructor(
		private readonly iterable: Iterable<T>
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new ReverseIterator(this.iterable[Symbol.iterator]());
	}

	//#endregion
}

class ReverseIterator<T> extends IteratorBase<T> {
	public constructor(
		private readonly iterator: Iterator<T>,
	) {
		super();
	}

	//#region property

	private items: Array<T> | undefined;
	private currentIndex = 0;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<T> {
		if (this.items === undefined) {
			this.items = [];
			while (true) {
				const result = this.iterator.next();
				if (result.done) {
					this.currentIndex = this.items.length;
					break;
				}
				this.items.push(result.value);
			}
		}

		if(this.currentIndex <= 0) {
			return this.done();
		}

		return this.yield(this.items[--this.currentIndex]);
	}

	//#endregion
}
