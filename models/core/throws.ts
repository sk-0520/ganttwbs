// エラー系
// GEN: 2022-12-04T18:11:58+09:00

// 手動 ---------------------



// 自動 ---------------------

/**
* 未実装
 */
export class NotImplementedError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotImplementedError';
	}
}

/**
* 実装が存在しない
 */
export class NotSupportedError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotSupportedError';
	}
}

/**
* 不正処理
 */
export class InvalidOperationError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'InvalidOperationError';
	}
}

/**
* 引数指定が異常
 */
export class MismatchArgumentError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'MismatchArgumentError';
	}
}

/**
* 引数が無効
 */
export class ArgumentError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'ArgumentError';
	}
}

/**
* パース系処理失敗
 */
export class ParseError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'ParseError';
	}
}

/**
* DOM処理云々がダメ
 */
export class DomError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'DomError';
	}
}

/**
* 指定要素の型が合わない
 */
export class ElementTypeError extends DomError {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'ElementTypeError';
	}
}

/**
* セレクタで要素が見つからない
 */
export class NotFoundDomSelectorError extends DomError {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotFoundDomSelectorError';
	}
}

