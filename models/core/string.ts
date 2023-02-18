import * as types from './types';
import * as regex from './regex';

/**
 * 空文字列か。
 *
 * @param s
 * @returns
 */
export function isEmpty(s: string | null | undefined): boolean {
	return types.isString(s) && s.length === 0;
}

/**
 * 非空文字列(ホワイトスペース構成は除く)か。
 *
 * @param s
 * @returns
 */
export function isNotWhiteSpace(s: string | null | undefined): s is string {
	return types.isString(s) && trim(s).length !== 0;
}

/**
 * トリムの未指定時の対象文字。
 */
const TrimCharacters: ReadonlySet<string> = new Set([
	"\u{0009}",
	"\u{000a}",
	"\u{000b}",
	"\u{000c}",
	"\u{000d}",
	"\u{0085}",
	"\u{00a0}",
	"\u{0020}",
	"\u{2000}",
	"\u{2001}",
	"\u{2002}",
	"\u{2003}",
	"\u{2004}",
	"\u{2005}",
	"\u{2006}",
	"\u{2007}",
	"\u{2008}",
	"\u{2009}",
	"\u{200A}",
	"\u{202F}",
	"\u{205F}",
	"\u{3000}",
]);

/**
 * 先頭文字列のトリム処理。
 * @param s
 * @param characters
 * @returns
 */
export function trimStart(s: string, characters: ReadonlySet<string> | null = null): string {
	characters ??= TrimCharacters;

	if (!characters.size) {
		return s;
	}

	for (let i = 0; i < s.length; i++) {
		if (characters.has(s[i])) {
			continue;
		}

		return s.substring(i);
	}

	return '';
}

/**
 * 終端文字列のトリム処理。
 * @param s
 * @param characters
 * @returns
 */
export function trimEnd(s: string, characters: ReadonlySet<string> | null = null): string {
	characters ??= TrimCharacters;

	if (!characters.size) {
		return s;
	}

	for (let i = 0; i < s.length; i++) {
		if (characters.has(s[s.length - i - 1])) {
			continue;
		}

		return s.substring(0, s.length - i);
	}

	return '';
}

/**
 * 前後のトリム処理。
 * @param s
 * @param characters
 * @returns
 */
export function trim(s: string, characters: ReadonlySet<string> | null = null): string {
	characters ??= TrimCharacters;

	if (!characters.size) {
		return s;
	}

	return trimEnd(trimStart(s, characters), characters);
}

export function replaceAllImpl(source: string, searchValue: string | RegExp, replaceValue: string): string {
	if (searchValue instanceof RegExp) {
		const flags = searchValue.flags.includes('g')
			? searchValue.flags
			: searchValue.flags + 'g'
			;
		return source.replace(new RegExp(searchValue.source, flags), replaceValue);
	}

	return source.replace(new RegExp(regex.escape(searchValue), 'g'), replaceValue);
}

export function replaceAll(source: string, searchValue: string | RegExp, replaceValue: string): string {
	if (!String.prototype.replaceAll) {
		return replaceAllImpl(source, searchValue, replaceValue);
	}

	return source.replaceAll(searchValue, replaceValue);
}

/**
 * 改行分割。
 * @param source
 * @returns
 */
export function splitLines(source: string | null | undefined): Array<string> {
	if (!source) {
		return [];
	}

	return source.split(/\r\n|\n|\r/);
}

export function toBoolean(s: string | null | undefined): boolean {
	if (!s) {
		return false;
	}

	return s.toLowerCase() === 'true';
}

export const enum MatchMode {
	Partial,
	Forward,
	Backward,
	Perfect,
	Regex,
}

export interface MatchResult {
	//#region property

	readonly matched: boolean;
	readonly isRegex: boolean;
	readonly regex: RegExp;

	//#endregion

	//#region function
	//#endregion
}

class MatchResultImpl {
	//#region variable

	private _matched: boolean;
	private _regex: RegExp | null;

	//#endregion

	private constructor(matched: boolean, regex: RegExp | null) {
		this._matched = matched;
		this._regex = regex;
	}

	//#region MatchResult

	public get matched(): boolean {
		return this._matched;
	}

	public get isRegex(): boolean {
		return this._regex !== null;
	}

	public get regex(): RegExp {
		if (!this._regex) {
			throw new Error('regex');
		}

		return this._regex;
	}

	//#endregion


	//#region function

	public static none(): MatchResultImpl {
		return new MatchResultImpl(false, null);
	}

	public static matchedPlain(): MatchResultImpl {
		return new MatchResultImpl(true, null);
	}

	public static matchedRegex(regex: RegExp): MatchResultImpl {
		return new MatchResultImpl(true, regex);
	}

	//#endregion
}

function matchPartial(input: string, pattern: string, ignoreCase: boolean): MatchResultImpl {
	let index = -1;
	if (ignoreCase) {
		index = input.toLowerCase().indexOf(pattern.toLowerCase());
	} else {
		index = input.indexOf(pattern);
	}
	if (index !== -1) {
		return MatchResultImpl.matchedPlain();
	}

	return MatchResultImpl.none();
}

function matchForward(input: string, pattern: string, ignoreCase: boolean): MatchResultImpl {
	if (ignoreCase) {
		if (input.toLowerCase().startsWith(pattern.toLowerCase())) {
			return MatchResultImpl.matchedPlain();
		}
	} else {
		if (input.startsWith(pattern)) {
			return MatchResultImpl.matchedPlain();
		}
	}

	return MatchResultImpl.none();
}

function matchBackward(input: string, pattern: string, ignoreCase: boolean): MatchResultImpl {
	if (ignoreCase) {
		if (input.toLowerCase().endsWith(pattern.toLowerCase())) {
			return MatchResultImpl.matchedPlain();
		}
	} else {
		if (input.endsWith(pattern)) {
			return MatchResultImpl.matchedPlain();
		}
	}

	return MatchResultImpl.none();
}

function matchPerfect(input: string, pattern: string, ignoreCase: boolean): MatchResultImpl {
	if (ignoreCase) {
		if (input.toLowerCase() === pattern.toLowerCase()) {
			return MatchResultImpl.matchedPlain();
		}
	} else {
		if (input === pattern) {
			return MatchResultImpl.matchedPlain();
		}
	}

	return MatchResultImpl.none();
}

function matchRegex(input: string, pattern: string, ignoreCase: boolean): MatchResultImpl {
	const flags = ignoreCase ? 'gi' : 'g';
	try {
		const regex = new RegExp(pattern, flags);
		if (regex.test(input)) {
			return MatchResultImpl.matchedRegex(regex);
		}
	} catch (ex) {
		console.warn('matchRegex', ex);
	}

	return MatchResultImpl.none();
}

export function match(input: string, pattern: string, ignoreCase: boolean, mode: MatchMode): MatchResult {
	switch (mode) {
		case MatchMode.Partial:
			return matchPartial(input, pattern, ignoreCase);

		case MatchMode.Forward:
			return matchForward(input, pattern, ignoreCase);

		case MatchMode.Backward:
			return matchBackward(input, pattern, ignoreCase);

		case MatchMode.Perfect:
			return matchPerfect(input, pattern, ignoreCase);

		case MatchMode.Regex:
			return matchRegex(input, pattern, ignoreCase);

		default:
			return MatchResultImpl.none();
	}
}
