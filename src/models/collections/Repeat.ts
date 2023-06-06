import { IteratorBase } from "@/models/collections/Iterator";

export class RepeatIterable<T> implements Iterable<T> {
	public constructor(
		private readonly value: T,
		private readonly count: number,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new RepeatIterator(this.value, this.count);
	}

	//#endregion
}

class RepeatIterator<T> extends IteratorBase<T> {
	public constructor(
		private readonly value: T,
		private readonly count: number,
	) {
		super();
	}

	//#region property

	private currentIndex = 0;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<T> {
		if (this.count <= this.currentIndex) {
			return this.done();
		}

		this.currentIndex += 1;

		return this.yield(this.value);
	}

	//#endregion
}
