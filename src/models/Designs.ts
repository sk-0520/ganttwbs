import { isValueUnit, ValueUnit } from "@/models/data/Design";

// セレクタとか難しい概念は知らん

type ClassName = string;
type Property = string;
type Value = string;

export abstract class Designs {

	private static readonly PropertyRegex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

	public static toValue(valueUnit: ValueUnit): string {
		if (valueUnit.value === 0) {
			return "0";
		}

		return `${valueUnit.value}${valueUnit.unit}`;
	}

	public static convertStyleClasses(obj: object, parents: ReadonlyArray<string>): Map<ClassName, Map<Property, Value>> {
		const result = new Map<ClassName, Map<Property, Value>>();

		const propertyValues = new Map<Property, Value>();

		for (const [selectorOrProperty, valuesOrNestedBlock] of Object.entries(obj)) {
			if (typeof (valuesOrNestedBlock) === "object") {
				if (isValueUnit(valuesOrNestedBlock)) {
					propertyValues.set(selectorOrProperty, Designs.toValue(valuesOrNestedBlock));
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

	public static toStyleClassName(s: string): string {
		return "." + s;
	}

	public static toStyleProperty(s: string): string {
		const matches = s.match(this.PropertyRegex);
		if (!matches) {
			throw new Error(s);
		}

		return matches
			.map(x => x.toLowerCase())
			.join("-")
			;
	}

	private static convertStylesheetBlock(map: Map<Property, Value>): Array<string> {
		return [...map.entries()]
			.sort(([ak, av], [bk, bv]) => ak.localeCompare(bk))
			.map(([k, v]) => `${this.toStyleProperty(k)}: ${v}`);
	}

	public static convertStylesheet(styleClasses: Map<ClassName, Map<Property, Value>>): string {
		const newLine = "\r\n";

		return [...styleClasses.entries()]
			.sort(([ak, av], [bk, bv]) => ak.localeCompare(bk))
			.map(([k, v]) => ({ key: k, values: v }))
			.map(a => ({ key: a.key, lines: this.convertStylesheetBlock(a.values) }))
			.map(a => {
				return [
					this.toStyleClassName(a.key),
					"{",
					a.lines.map(aa => `\t${aa};`).join(newLine),
					"}",
				].join(newLine);
			})
			.join(newLine)
			;
	}

}
