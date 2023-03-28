import { isValueUnit, ValueUnit } from "./data/Design";

// セレクタとか難しい概念は知らん

type ClassName = string;
type Property = string;
type Value = string;

export abstract class Designs {

	public static toProperty(valueUnit: ValueUnit): string {
		if (valueUnit.value === 0) {
			return '0';
		}

		return `${valueUnit.value}${valueUnit.unit}`;
	}

	public static convertStyleClasses(obj: object, parents: ReadonlyArray<string>): Map<ClassName, Map<Property, Value>> {
		// const result = new Map<ClassName, Map<Property, Value>>();

		// for (const [className, propertiesOrNestedClass] of Object.entries(obj)) {
		// 	const properties = new Map<Property, Value>();

		// 	if (typeof (propertiesOrNestedClass) === 'object') {
		// 		if (isValueUnit(propertiesOrNestedClass)) {
		// 			// result.push({
		// 			// 	className: key,
		// 			// 	properties: {
		// 			// 		[key]: Designs.toProperty(vu)
		// 			// 	}
		// 			// });
		// 		} else {
		// 			const map = this.convertStyleClasses(propertiesOrNestedClass, [...parents, className]);
		// 			for (const [key, value] of map) {
		// 				result.set(key, value);
		// 			}
		// 			continue;
		// 		}
		// 	} else {
		// 		properties.set(className, propertiesOrNestedClass);
		// 	}
		// }

		// return result;
	}


}
