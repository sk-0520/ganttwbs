const escapeRegex = /[.*+?^${}()|[\]\\]/g;

/**
 * 正規表現エスケープ。
 *
 * @param source
 * @returns
 */
export function escape(source: string): string {
	return source.replace(escapeRegex, '\\$&');
}
