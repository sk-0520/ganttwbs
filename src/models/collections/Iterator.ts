/* eslint-disable @typescript-eslint/no-explicit-any */

export type Predicate<T> = (value: T) => boolean;

export abstract class IteratorBase<T> implements IterableIterator<T>{

	public abstract next(...args: [] | [undefined]): IteratorResult<T, any>;

	public return?(value?: any): IteratorResult<T, any> {
		throw new Error("Method not implemented.");
	}
	public throw?(e?: any): IteratorResult<T, any> {
		throw new Error("Method not implemented.");
	}

	public [Symbol.iterator](): IterableIterator<T> {
		return this;
	}

	protected done(): IteratorResult<T> {
		return {
			done: true,
			value: undefined
		};
	}
	protected yield(value: T): IteratorResult<T> {
		return {
			done: false,
			value: value
		};
	}

}
