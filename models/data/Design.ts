
/**
 * 単位付きの値。
 */
export interface ValueUnit {
	value: number;
	unit: 'px' | string;
}

export interface Design {
	cell: {
		maxWidth: string;
		minWidth: string;
		maxHeight: string;
		minHeight: string;
		width: ValueUnit;
		height: ValueUnit;
	}
}
