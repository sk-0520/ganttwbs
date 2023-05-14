/** クラス的な。 */
export type Constructor<T extends object> = {
	prototype: T,
};

export abstract class Types {

	/**
	 * 型が `undefined` か。
	 * @param arg
	 * @returns
	 */
	public static isUndefined(arg: unknown): arg is undefined {
		return typeof arg === "undefined";
	}
	/**
	 * 型が `null` か。
	 * @param arg
	 * @returns
	 */
	public static isNull(arg: unknown): arg is null {
		return arg === null;
	}

	/**
	 * 型が `undefined | null` か。
	 * @param arg
	 */
	public static isNullish(arg: unknown): arg is null | undefined {
		return this.isUndefined(arg) || this.isNull(arg);
	}

	public static isString(arg: unknown): arg is string {
		return typeof arg === "string";
	}

	public static isNumber(arg: unknown): arg is string {
		return typeof arg === "number";
	}

	public static hasProperty(arg: unknown, key: PropertyKey): arg is Record<PropertyKey, unknown> {
		return arg !== undefined && arg !== null && typeof arg === "object" && key in arg;
	}

	/**
	 * 指定したオブジェクトが指定したクラス(コンストラクタ)の継承関係しているか
	 * @param arg
	 * @param type
	 * @returns
	 */
	public static instanceOf<T extends object>(arg: unknown, type: Constructor<T>): arg is T {
		return arg instanceof type.prototype.constructor;
	}


	/**
	 * 指定したオブジェクトが指定したクラス(コンストラクタ)と同じか
	 * @param arg
	 * @param type
	 * @returns
	 */
	public static isEqual<T extends object>(arg: unknown, type: Constructor<T>): arg is T {
		if (!this.hasProperty(arg, "constructor")) {
			return false;
		}

		return arg.constructor.prototype === type.prototype;
	}

	/**
	 * オブジェクトから変数とプロパティ(ゲッター)の名前を取得。
	 * @param obj
	 * @returns
	 */
	public static getProperties<T extends object>(obj: T): Set<keyof T> {
		const result = new Set<keyof T>();

		let current = obj;

		while (true) {
			const prototype = Object.getPrototypeOf(current);
			if (prototype === null) {
				break;
			}

			const currentPropertyNames = Object.getOwnPropertyNames(prototype) as Array<keyof T>;
			const targets = currentPropertyNames.filter(i => {
				const descriptor = Object.getOwnPropertyDescriptor(prototype, i);
				return i !== "__proto__" && descriptor?.get instanceof Function;
			});

			for (const target of targets) {
				result.add(target);
			}

			current = prototype;
		}

		for (const target in obj) {
			result.add(target);
		}

		return result;
	}
}
