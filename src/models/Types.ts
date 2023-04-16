export abstract class Types {

	public static isUndefined(arg: unknown): arg is undefined {
		return typeof arg === "undefined";
	}

	public static isString(arg: unknown): arg is string {
		return typeof arg === "string";
	}
}
