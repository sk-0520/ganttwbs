import { IteratorBase } from "@/models/collections/Iterator";

export class RangeIterable implements Iterable<number> {
	public constructor(
		private readonly start: number,
		private readonly count: number,
	) {
	}

	//#region Iterable

	public [Symbol.iterator](): Iterator<number> {
		return new RangeIterator(this.start, this.count);
	}

	//#endregion
}

class RangeIterator extends IteratorBase<number> {
	public constructor(
		private readonly start: number,
		private readonly count: number,
	) {
		super();
		this.currentValue = start;
	}

	//#region property

	private currentValue: number;

	//#endregion

	//#region IteratorBase

	public next(): IteratorResult<number> {
		if (this.currentValue === this.start + this.count) {
			return {
				done: true,
				value: undefined,
			};
		}

		return {
			done: false,
			value: this.currentValue++,
		};
	}

	//#endregion
}
