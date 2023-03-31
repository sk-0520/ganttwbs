
/**
 * 単位付きの値。
 */
export interface ValueUnit {
	value: number;
	unit: 'px' | string;
}

export function isValueUnit(args: unknown): args is ValueUnit {
	return args !== null
		&& typeof (args) === 'object'
		&& 'value' in args
		&& 'unit' in args
		&& typeof (args.value) === "number"
		&& typeof (args.unit) === "string"
		;
}

export interface Design {
	/** 単純なスタイルシート */
	honest: {
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
		indexNumber: {
			/** 最大値 */
			maximum: number;
			/** 左余白基準 */
			paddingLeft: ValueUnit;
		};
	}
}
