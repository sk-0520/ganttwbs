/**
 * リミッター。
 *
 * ループ中にインクリメントして処理継続が可能かを判断する想定。
 */
export class Limiter {

	private _count = 0;

	public constructor(public readonly max: number) {
		if (this.max <= 0) {
			throw new RangeError();
		}
	}

	/**
	 * 現在カウント。
	 */
	public get count() {
		return this._count;
	}

	/**
	 * 継続不可か。
	 */
	public get isLimit() {
		return this.max <= this._count;
	}

	/**
	 * カウントアップ。
	 * @returns 真: 継続不可。(ループ冒頭でifで囲う想定なので継続不可は真とする)
	 */
	public increment(): boolean {
		if (this.isLimit) {
			return true;
		}

		this._count += 1;
		return false;
	}

	/**
	 * 初期化。
	 */
	public reset(): void {
		this._count = 0;
	}
}
