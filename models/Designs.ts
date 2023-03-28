import { isValueUnit, ValueUnit } from "./data/Design";

// セレクタとか難しい概念は知らん

type Property = string;
type Value = string;

export abstract class Designs {

	public static toProperty(valueUnit: ValueUnit): string {
		if (valueUnit.value === 0) {
			return '0';
		}

		return `${valueUnit.value}${valueUnit.unit}`;
	}

	public static convertStyleClasses(obj: object, parents: ReadonlyArray<string>): Map<string, Map<Property, Value>> {
		const result = new Map<string, Map<Property, Value>>();

		const properties = new Map<Property, Value>();

		for (const [className, valuesOrNestedBlock] of Object.entries(obj)) {
			if (typeof (valuesOrNestedBlock) === 'object') {
				if (isValueUnit(valuesOrNestedBlock)) {
					// result.push({
					// 	className: key,
					// 	properties: {
					// 		[key]: Designs.toProperty(vu)
					// 	}
					// });
				} else {
					const map = this.convertStyleClasses(valuesOrNestedBlock, [...parents, className]);
					for (const [key, value] of map) {
						result.set(key, value);
					}
				}
			} else {
				properties.set(className, valuesOrNestedBlock);
			}
		}

		if (properties.size) {
			result.set(parents.join("_"), properties);
		}

		return result;
	}


}
