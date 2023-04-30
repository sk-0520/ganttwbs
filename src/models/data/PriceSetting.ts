interface PriceInputSetting {
	readonly minimum: number,
	readonly maximum: number | undefined,
	readonly step: number,
}

export interface PriceSetting {
	readonly input: {
		readonly cost: PriceInputSetting;
		readonly sales: PriceInputSetting;
	};
	readonly price: {
		readonly cost: number;
		readonly sales: number;
	};
}
