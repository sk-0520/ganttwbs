import { Atom } from "jotai";

export interface AtomReader<T> {
	data: Readonly<T>;
}

export interface AtomWriter<T> {
	write(arg: T | ((prev: T) => T)): void;
}

/**
 * `atom<T>` の `T` を取得する。
 *
 * ```
 * const TargetAtom = atom(123);
 * type T = AtomType<typeof TargetAtom>;
 * const func = (v:T) => // T is number
 * ```
 */
export type AtomType<TAtom extends Atom<unknown>> = TAtom extends Atom<infer T>
	? T
	: unknown
	;
