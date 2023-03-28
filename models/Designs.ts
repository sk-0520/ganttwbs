import { ValueUnit } from "./data/Design";

interface StyleProperty {
	selector: string;
	property: string;
}


interface StyleClass {
	className: string,
	properties: Array<StyleProperty>
}



export abstract class Designs {

	public static toProperty(valueUnit: ValueUnit): string {
		if (valueUnit.value === 0) {
			return '0';
		}

		return `${valueUnit.value}${valueUnit.unit}`;
	}

	public static convertStyles(obj: object, parents: ReadonlyArray<string>): Array<StyleClass> {
		const result = new Array<StyleClass>()

		for (const [key, value] of Object.entries(obj)) {
			if (typeof (value) === 'object') {
				if ('value' in value && 'unit' in value) {
					const vu = value as ValueUnit;
					// result.push({
					// 	className: key,
					// 	properties: {
					// 		[key]: Designs.toProperty(vu)
					// 	}
					// });
				} else {
					const items = this.convertStyles(value, [...parents, key]);
					result.push(...items);
				}
			} else {

			}
		}

		return result;
	}


}
