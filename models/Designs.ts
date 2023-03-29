import { isValueUnit, ValueUnit } from "./data/Design";

// セレクタとか難しい概念は知らん

type ClassName = string;
type Property = string;
type Value = string;

type StyleObject = { [key: string]: string | ValueUnit | StyleObject }

export abstract class Designs {

	public static toValue(valueUnit: ValueUnit): string {
		if (valueUnit.value === 0) {
			return '0';
		}

		return `${valueUnit.value}${valueUnit.unit}`;
	}

	public static convertStyleClasses(obj: StyleObject, parents: ReadonlyArray<string>): Map<ClassName, Map<Property, Value>> {
		const result = new Map<ClassName, Map<Property, Value>>();

		const propertyValues = new Map<Property, Value>();

		for (const [selectorOrProperty, valuesOrNestedBlock] of Object.entries(obj)) {
			if (typeof (valuesOrNestedBlock) === 'object') {
				if (isValueUnit(valuesOrNestedBlock)) {
					propertyValues.set(selectorOrProperty, Designs.toValue(valuesOrNestedBlock))
				} else {
					const map = this.convertStyleClasses(valuesOrNestedBlock, [...parents, selectorOrProperty]);
					for (const [key, value] of map) {
						result.set(key, value);
					}
				}
			} else {
				propertyValues.set(selectorOrProperty, valuesOrNestedBlock);
			}
		}

		if (propertyValues.size) {
			result.set(parents.join("_"), propertyValues);
		}

		return result;
	}


}
