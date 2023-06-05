import { IteratorBase } from "@/models/collections/Iterator";

export class AppendIterable<T> implements Iterable<T> {

	private items = new Array<Iterable<T>>;

	public append(iterable: Iterable<T>): void {
		this.items.push(iterable);
	}

	public [Symbol.iterator](): Iterator<T> {
		return new AppendIterator(this.items.map(a => a[Symbol.iterator]()));
	}
}

class AppendIterator<T> extends IteratorBase<T> {
	public constructor(
		private iterators: Array<Iterator<T>>
	) {
		super();
	}

	//#region property

	private currentIndex = 0;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<T> {
		while (true) {
			if (this.iterators.length <= this.currentIndex) {
				return {
					done: true,
					value: undefined
				};
			}

			const iterator = this.iterators[this.currentIndex];
			const result = iterator.next();
			if (result.done) {
				this.currentIndex += 1;
				continue;
			}

			return result;
		}
	}

	//#endregion
}
