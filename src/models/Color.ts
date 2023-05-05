import { TinyColor } from "@ctrl/tinycolor";

import { ParseResult, ResultFactory } from "@/models/data/Result";
import { ColorString } from "@/models/data/Setting";
import { Types } from "@/models/Types";

type ColorParseResult = ParseResult<Color, Error>;

export class Color {

	public constructor(public readonly raw: TinyColor) {
		if (!raw.isValid) {
			throw new Error();
		}
	}

	//#region property

	public get r(): number {
		return this.raw.r;
	}

	public get g(): number {
		return this.raw.g;
	}

	public get b(): number {
		return this.raw.b;
	}

	public get a(): number {
		return this.raw.a;
	}

	//#endregion

	//#region function

	private static parseCore(input: ColorString): ColorParseResult {
		const color = new TinyColor(input);
		if (color.isValid) {
			return ResultFactory.success(new Color(color));
		}

		return ResultFactory.failure(new Error(input));
	}

	public static parse(input: string): Color {
		return ResultFactory.parseErrorIsThrow(input, s => this.parseCore(s));
	}

	public static tryParse(input: string): Color | null {
		return ResultFactory.parseErrorIsReturnNull(input, s => this.parseCore(s));
	}

	public static create(r: number, g: number, b: number, a?: number): Color {
		function enforce(v: number, name: "r" | "g" | "b" | "a"): number {
			if (name === "a") {
				if (v < 0 || 1 < v) {
					throw new Error(name + ":" + v.toString());
				}
			} else {
				if (v < 0 || 0xff < v) {
					throw new Error(name + ":" + v.toString());
				}
			}

			return v;
		}

		const colorImpl = new TinyColor({
			r: enforce(r, "r"),
			g: enforce(g, "g"),
			b: enforce(b, "b"),
			a: Types.isUndefined(a) ? undefined : enforce(a, "a")
		});

		return new Color(colorImpl);
	}

	public equals(color: Color): boolean {
		return this.raw.equals(color.raw);
	}

	public toHtml(): ColorString {
		return this.raw.toHexString();
	}

	//#endregion
}
