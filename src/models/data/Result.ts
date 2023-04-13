
export type Result<S, E> = SuccessResult<S> | FailureResult<E>;

interface SuccessResult<S> {
	readonly success: true;
	readonly value: S;
}

interface FailureResult<E> {
	readonly success: false;
	readonly error: E;
}

export type ParseResult<S, E extends Error> = Result<S, E>;

export abstract class ResultFactory {

	public static success<S>(value: S): SuccessResult<S> {
		return {
			success: true,
			value: value,
		};
	}

	public static failure<E>(error: E): FailureResult<E> {
		return {
			success: false,
			error: error,
		};
	}

	public static error<E extends Error>(error: E): FailureResult<E> {
		return this.failure(error);
	}
}
