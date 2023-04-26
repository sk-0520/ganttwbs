export class Limiter {

	private _count = 0;

	public constructor(public readonly max: number) {
		if (this.max <= 0) {
			throw new RangeError();
		}
	}

	public get count() {
		return this._count;
	}

	public get isLimit() {
		return this.max <= this._count;
	}

	public increment(): boolean {
		if (this.isLimit) {
			return true;
		}

		this._count += 1;
		return false;
	}
}
