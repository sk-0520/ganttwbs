
/**
 * 単位付きの値。
 */
export interface ValueUnit {
	value: number;
	unit: "px" | string;
}

export function isValueUnit(args: unknown): args is ValueUnit {
	return args !== null
		&& typeof (args) === "object"
		&& "value" in args
		&& "unit" in args
		&& typeof (args.value) === "number"
		&& typeof (args.unit) === "string";
}

export interface Design {
	/** デザイン元データ */
	seed: {
		cell: {
			width: ValueUnit;
			height: ValueUnit;
		}
	},

	/** 計算したり抜粋する系の基準値 */
	programmable: {
		group: {
			/** 最大値 */
			maximum: number;
		};
		/** 表示番号 */
		readableTimelineId: {
			/** 最大値 */
			maximum: number;
			/** 左余白基準 */
			paddingLeft: ValueUnit;
		};
	},

	/** 使用しない領域 */
	dummy: {
		width: number,
		height: number,
	}
}
