
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
	cell: {
		maxWidth: string;
		minWidth: string;
		maxHeight: string;
		minHeight: string;
		width: ValueUnit;
		height: ValueUnit;
	}
}
