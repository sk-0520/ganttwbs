import { ValueUnit } from "./data/Design";

export abstract class Designs {

	public static toProperty(unitValue: ValueUnit): string {
		return `${unitValue.value}${unitValue.unit}`;
	}

}
