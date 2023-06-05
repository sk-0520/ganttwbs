import { IteratorBase } from "@/models/collections/Iterator";

export class SelectManyIterable<TSource, TCollection extends Iterable<TSource>, TResult> implements Iterable<TResult> {
	public constructor(
		private readonly iterable: Iterable<TCollection>,
		private readonly selector: (source: TSource, index: number) => TResult,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<TResult> {
		return new SelectManyIterator(this.iterable[Symbol.iterator](), this.selector);
	}

	//#endregion
}

class SelectManyIterator<TSource, TCollection extends Iterable<TSource>, TResult> extends IteratorBase<TResult> {
	public constructor(
		private readonly outerIterator: Iterator<TCollection>,
		private readonly selector: (source: TSource, index: number) => TResult,
	) {
		super();
	}

	//#region property

	private currentIndex = 0;
	private innerIterator: Iterator<TSource> | undefined = undefined;

	//#endregion

	//#region function

	private rebuildInnerIterator(): boolean {
		const result = this.outerIterator.next();
		if (result.done) {
			return false;
		}

		this.innerIterator = result.value[Symbol.iterator]();
		return true;
	}

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<TResult> {
		if (this.innerIterator === undefined) {
			if (!this.rebuildInnerIterator()) {
				return {
					done: true,
					value: undefined,
				};
			}
		}

		if (this.innerIterator === undefined) {
			return {
				done: true,
				value: undefined,
			};
		}

		while (true) {
			const result = this.innerIterator.next();
			if (result.done) {
				if (!this.rebuildInnerIterator()) {
					return {
						done: true,
						value: undefined,
					};
				}
				continue;
			}

			return {
				done: false,
				value: this.selector(result.value, this.currentIndex++),
			};
		}

	}

	//#endregion
}
