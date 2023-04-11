
export type Result<S, E> = SuccessResult<S> | FailureResult<E>;

interface ResultBase {
	readonly success: boolean;
}

interface SuccessResult<T> extends ResultBase {
	readonly success: true;
	readonly value: T;
}

interface FailureResult<T> extends ResultBase {
	readonly success: false;
	readonly error: T;
}
