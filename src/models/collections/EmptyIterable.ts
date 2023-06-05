import { IteratorBase } from "@/models/collections/Iterator";

export class EmptyIterable<T> implements Iterable<T> {
	public constructor(
	) {
		//nop
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<T> {
		return new EmptyIterator();
	}

	//#endregion
}

class EmptyIterator<T> extends IteratorBase<T> {
	public constructor(
	) {
		super();
	}

	//#region IteratorBase

	public next(): IteratorResult<T> {
		return {
			done: true,
			value: undefined,
		};
	}

	//#endregion
}
