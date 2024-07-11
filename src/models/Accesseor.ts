export function requireArray<TValue>(
	array: ReadonlyArray<TValue>,
	key: number,
): TValue {
	if (key in array) {
		return array[key];
	}
	throw new Error();
}

export function requireRecord<TKey extends PropertyKey, TValue>(
	record: Readonly<Record<TKey, TValue>>,
	key: TKey,
): TValue {
	if (key in record) {
		return record[key];
	}
	throw new Error();
}

export function requireMap<TKey extends PropertyKey, TValue>(
	map: ReadonlyMap<TKey, TValue> | Map<TKey, TValue>,
	key: TKey,
): TValue {
	if (map.has(key)) {
		return map.get(key) as TValue;
	}
	throw new Error();
}
