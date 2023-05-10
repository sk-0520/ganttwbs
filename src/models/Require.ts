/* eslint-disable @typescript-eslint/no-explicit-any */
//type NonUndefined<T> = T extends undefined ? never : T;

/**
 * 絶対に何か取得する系の処理。
 *
 * 取得できない場合は死ぬ。
 * ※配列系は `Arrays` を参照のこと。
 */
export abstract class Require {

	/**
	 * `Map<K,V>` から値を取得。
	 * 取得した値が `undefined` の場合に例外を投げるため、値として有効な `undefined` が入らない個所で使用すること。
	 * @param map マップ
	 * @param key 取得するキー
	 * @returns 値。
	 * @throws `undefined` の場合に `Error`
	 */
	//public static get<K, V>(map: ReadonlyMap<K, NonUndefined<V>>, key: K): NonUndefined<V> {
	public static get<K, V>(map: ReadonlyMap<K, V>, key: K): V {
		const result = map.get(key);
		if (result === undefined) {
			throw new Error(`key: ${key}`);
		}

		return result;
	}

}
