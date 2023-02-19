/**
 * プロパティ名として使用可能なキー。
 *
 * `number` いる？
 */
export type PropertyKey = string | symbol;

/** クラス的な。 */
export type Constructor<T extends object> = {
	prototype: T,
};

declare const _Strong: unique symbol;
/**
 * 強い型。
 */
export type Strong<T, U = string> = T & { readonly [_Strong]: U };

/**
 * 型が `undefined` か。
 * @param arg
 * @returns
 */
export function isUndefined(arg: unknown): arg is undefined {
	return typeof arg === 'undefined';
}

/**
 * 型が `null` か。
 * @param arg
 * @returns
 */
export function isNull(arg: unknown): arg is null {
	return arg === null;
}

/**
 * 型が `undefined | null` か。
 * @param arg
 */
export function isNullish(arg: unknown): arg is null | undefined {
	return isUndefined(arg) || isNull(arg);
}


/**
 * 型が `Symbol` か。
 * @param arg
 * @returns
 */
export function isSymbol(arg: unknown): arg is Symbol {
	return typeof arg === 'symbol';
}

/**
 * 型が `string` か。
 * @param arg
 * @returns
 */
export function isString(arg: unknown): arg is string {
	return typeof arg === 'string';
}

/**
 * 型が `number` か。
 * @param arg
 * @returns
 */
export function isNumber(arg: unknown): arg is number {
	return typeof arg === 'number';
}

/**
 * 型が `bigint` か。
 * @param arg
 * @returns
 */
export function isBigInt(arg: unknown): arg is bigint {
	return typeof arg === 'bigint';
}

/**
 * 型が `boolean` か。
 * @param arg
 * @returns
 */
export function isBoolean(arg: unknown): arg is boolean {
	return typeof arg === 'boolean';
}

/**
 * 型が配列か。
 * @param arg
 * @returns
 */
export function isArray<T extends unknown>(arg: unknown): arg is Array<T> {
	return Array.isArray(arg);
}

/**
 * 型がオブジェクトか。
 * @param arg
 * @returns
 */
export function isObject(arg: unknown): arg is Object {
	return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
}

/**
 * 型が関数か。
 * @param arg
 * @returns
 */
export function isFunction<T extends Function>(arg: unknown): arg is T {
	return typeof arg === 'function';
}

/**
 * 指定したプロパティを持つか。
 * @param arg 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasProperty(arg: unknown, key: PropertyKey): arg is Record<PropertyKey, unknown> {
	return arg !== undefined && arg !== null && typeof arg === 'object' && key in arg;
}

/**
 * 指定したプロパティ(型: `undefined`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasUndefined(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, undefined> {
	return hasProperty(obj, key) && isUndefined(obj[key]);
}

/**
 * 指定したプロパティ(型: `null`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasNull(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, null> {
	return hasProperty(obj, key) && isNull(obj[key]);
}

/**
 * 指定したプロパティ(型: `null | undefined`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasNullish(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, null | undefined> {
	return hasProperty(obj, key) && (isUndefined(obj[key]) || isNull(obj[key]));
}

/**
 * 指定したプロパティ(型: `Symbol`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasSymbol(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, Symbol> {
	return hasProperty(obj, key) && isSymbol(obj[key]);
}

/**
 * 指定したプロパティ(型: `string`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasString(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, string> {
	return hasProperty(obj, key) && isString(obj[key]);
}

/**
 * 指定したプロパティ(型: `number`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasNumber(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, number> {
	return hasProperty(obj, key) && isNumber(obj[key]);
}

/**
 * 指定したプロパティ(型: `bigint`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasBigInt(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, bigint> {
	return hasProperty(obj, key) && isBigInt(obj[key]);
}

/**
 * 指定したプロパティ(型: `boolean`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasBoolean(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, boolean> {
	return hasProperty(obj, key) && isBoolean(obj[key]);
}

/**
 * 指定したプロパティ(型: `object`)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasObject(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, Object> {
	return hasProperty(obj, key) && isObject(obj[key]);
}

/**
 * 指定したプロパティ(型: 配列)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasArray<T extends unknown>(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, Array<T>> {
	return hasProperty(obj, key) && isArray<T>(obj[key]);
}

/**
 * 指定したプロパティ(型: 関数)を持つか。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @returns
 */
export function hasFunction<T extends Function>(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, T> {
	return hasProperty(obj, key) && isFunction<T>(obj[key]);
}

/**
 * 指定したプロパティから値を取得。
 * @param obj 対象オブジェクト。
 * @param key プロパティ名。
 * @param fallbackValue 失敗時の値。対象の値の型と合わない場合にも使用される。
 * @returns
 */
export function getPropertyOr<TResult>(obj: unknown, key: string, fallbackValue: TResult): TResult {
	if (hasProperty(obj, key)) {
		if (typeof fallbackValue === typeof obj[key]) {
			return obj[key] as TResult;
		}
	}

	return fallbackValue;
}

/**
 * 指定された型ガードを満たす配列か。
 * @param arg
 * @param guard 型ガード。
 * @returns
 */
export function isTArray<T>(arg: unknown, guard: (item: unknown) => item is T): arg is Array<T> {
	if (!isArray(arg)) {
		return false;
	}

	//TODO: 空の扱いが微妙過ぎる
	if (!arg.length) {
		return true;
	}

	return arg.every(i => guard(i));
}

/**
 * 文字列配列か。
 * @param arg
 * @returns
 */
export function isStringArray(arg: unknown): arg is Array<string> {
	return isTArray(arg, isString);
}

/**
 * 数値配列か。
 * @param arg
 * @returns
 */
export function isNumberArray(arg: unknown): arg is Array<string> {
	return isTArray(arg, isNumber);
}

/**
 * 真偽値配列か。
 * @param arg
 * @returns
 */
export function isBooleanArray(arg: unknown): arg is Array<string> {
	return isTArray(arg, isBoolean);
}

/**
 * 指定された型ガードを満たす要素のみの配列を返却。
 * @param arg
 * @param guard
 * @returns
 */
export function filterTArray<T>(arg: unknown, guard: (item: unknown) => item is T): Array<T> {
	if (!isArray(arg)) {
		return [];
	}

	const result = new Array<T>();
	for (const item of arg) {
		if (guard(item)) {
			result.push(item);
		}
	}

	return result;
}

/**
 * 要素が文字列の配列を返却。
 * @param arg
 * @returns
 */
export function filterStringArray(arg: unknown): Array<string> {
	return filterTArray(arg, isString);
}

/**
 * 要素が数値の配列を返却。
 * @param arg
 * @returns
 */
export function filterNumberArray(arg: unknown): Array<number> {
	return filterTArray(arg, isNumber);
}

/**
 * 要素が真偽値の配列を返却。
 * @param arg
 * @returns
 */
export function filterBooleanArray(arg: unknown): Array<boolean> {
	return filterTArray(arg, isBoolean);
}

/**
 * 指定したオブジェクトが指定したクラス(コンストラクタ)の継承関係しているか
 * @param arg
 * @param type
 * @returns
 */
export function instanceOf<T extends object>(arg: unknown, type: Constructor<T>): arg is T {
	return arg instanceof type.prototype.constructor;
}

/**
 * 指定したオブジェクトが指定したクラス(コンストラクタ)と同じか
 * @param arg
 * @param type
 * @returns
 */
export function isEqual<T extends object>(arg: unknown, type: Constructor<T>): arg is T {
	if (!hasProperty(arg, 'constructor')) {
		return false;
	}

	return arg.constructor.prototype === type.prototype;
}

/**
 * オブジェクトから変数とプロパティ(ゲッター)の名前を取得。
 * @param obj
 * @returns
 */
export function getProperties<T extends object>(obj: T): Set<keyof T> {
	const result = new Set<keyof T>();

	let current = obj;

	while (true) {
		const prototype = Object.getPrototypeOf(current);
		if (prototype === null) {
			break;
		}

		const currentPropertyNames = Object.getOwnPropertyNames(prototype) as Array<keyof T>;
		const targets = currentPropertyNames.filter(i => {
			const descriptor = Object.getOwnPropertyDescriptor(prototype, i);;
			return i !== '__proto__' && descriptor?.get instanceof Function;
		});

		for (const target of targets) {
			result.add(target)
		}

		current = prototype;
	}

	for (const target in obj) {
		result.add(target)
	}

	return result;
}

/**
 * `TResult` のプロパティ名を満たす平坦なオブジェクトとして複製。
 * @param source
 * @returns
 */
export function flatClone<TResult extends { [K in keyof TResult]: TResult[K] }, TSource extends TResult = TResult>(source: TSource): TResult {
	const properties = getProperties(source);

	const result = Object.fromEntries([...properties].map(i => [i, source[i]]));

	return result as any as TResult;
}

export function nameof(name: Function): string;
export function nameof<T extends object>(name: Extract<keyof T, string>): string;
export function nameof<T>(name: Extract<keyof T, string> | Function): string {
	if (typeof name === 'function') {
		return name.name;
	}

	return name;
}

export function toString(input: any): string {
	switch (typeof input) {
		case 'object':
			if (input === null) {
				return 'null';
			} else {
				break;
			}

		case 'undefined':
			return 'undefined';

		case 'boolean':
			return input ? 'true' : 'false';

		default:
			break;
	}

	return input + '';
}
