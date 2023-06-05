import { IteratorBase } from "@/models/collections/Iterator";

export class SelectIterable<TSource, TResult> implements Iterable<TResult> {
	public constructor(
		private readonly iterable: Iterable<TSource>,
		private readonly selector: (source: TSource, index: number) => TResult,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<TResult> {
		return new SelectIterator(this.iterable[Symbol.iterator](), this.selector);
	}

	//#endregion
}

class SelectIterator<TSource, TResult> extends IteratorBase<TResult> {
	public constructor(
		private readonly iterator: Iterator<TSource>,
		private readonly selector: (source: TSource, index: number) => TResult,
	) {
		super();
	}

	//#region property

	private currentIndex = 0;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<TResult> {
		const result = this.iterator.next();
		if (result.done) {
			return result;
		}
		const v = this.selector(result.value, this.currentIndex++);
		return {
			done: false,
			value: v,
		};
	}

	//#endregion
}
