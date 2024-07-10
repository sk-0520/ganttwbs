import { IteratorBase } from "@/models/collections/Iterator";

export class EmptyIterable<T> implements Iterable<T> {
	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new EmptyIterator();
	}

	//#endregion
}

class EmptyIterator<T> extends IteratorBase<T> {
	//#region IteratorBase

	public next(): IteratorResult<T> {
		return this.done();
	}

	//#endregion
}
