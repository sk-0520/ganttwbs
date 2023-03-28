import { ValueUnit } from "./data/Design";

export abstract class Designs {

	public static toProperty(valueUnit: ValueUnit): string {
		if (valueUnit.value === 0) {
			return '0';
		}

		return `${valueUnit.value}${valueUnit.unit}`;
	}

}
