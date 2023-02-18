import * as throws from './throws';

/**
 * 数値埋め処理。
 *
 * なぜこれを作ったのか、謎い。
 *
 * @param input 数値。
 * @param width 幅数。
 * @param c 埋め文字。
 * @returns
 */
export function padding(input: number, width: number, c: string): string {
	if (input < 0) {
		throw new Error('input is negative');
	}
	if (c.length != 1) {
		throw new Error('c.length is ' + c.length);
	}

	const numberValue = input.toString();

	// 埋める余地がない場合はそのまま返す
	if (width <= numberValue.length) {
		return numberValue;
	}
	const count = width - numberValue.length;
	const result = c.repeat(count) + numberValue;
	return result;
}

/**
 * `parseInt` ラッパー。
 * @param input 数値。
 * @param radix 基数(未指定で10進数)。
 * @returns 整数。
 * @throws {throws.ParseError} パース失敗。
 */
export function parseInt(input: string, radix?: number | undefined) {
	const value = globalThis.parseInt(input, radix);

	if (isNaN(value)) {
		throw new throws.ParseError(`input: ${input}, radix: ${radix}`);
	}

	return value;
}

/**
 * `parseInt` ラッパー。
 * @param input 数値。
 * @param fallback パース失敗時の戻り値。
 * @param radix 基数(未指定で10進数)。
 * @returns 整数。
 * @throws {throws.ArgumentError} `fallback` が整数ではない。
 */
export function parseIntOr(input: string, fallback: number, radix?: number | undefined) {
	if (!Number.isInteger(fallback)) {
		throw new throws.ArgumentError('fallback: Number.isInteger');
	}

	const value = globalThis.parseInt(input, radix);

	if (isNaN(value)) {
		return fallback;
	}

	return value;
}

/**
 * `parseFloat` ラッパー。
 * @param input 数値。
 * @returns 実数。
 * @throws {throws.ParseError} パース失敗。
 */
export function parseFloat(input: string) {
	const value = globalThis.parseFloat(input);

	if (isNaN(value)) {
		throw new throws.ParseError(`input: ${input}`);
	}

	return value;
}

/**
 * `parseFloat` ラッパー。
 * @param input 数値。
 * @param fallback パース失敗時の戻り値。
 * @returns 実数。
 */
export function parseFloatOr(input: string, fallback: number) {
	const value = globalThis.parseFloat(input);

	if (isNaN(value)) {
		return fallback;
	}

	return value;
}
