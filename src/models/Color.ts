import { mostReadable, random, TinyColor } from "@ctrl/tinycolor";

import { ParseResult, ResultFactory } from "@/models/data/Result";
import { ColorString } from "@/models/data/Setting";
import { Types } from "@/models/Types";

type ColorParseResult = ParseResult<Color, Error>;

export class Color {

	private constructor(public readonly raw: TinyColor) {
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

	/**
	 * HTMLで用いられる色に変換する。
	 * @returns #RRGGBB
	 */
	public toHtml(): ColorString {
		return this.raw.toHexString();
	}

	/**
	 * 現在の色に対して読みやすい(?)色を取得
	 * @param color
	 * @returns
	 */
	public getAutoColor(): Color {
		const autoColors = [Colors.black, Colors.white];
		const result = mostReadable(
			this.raw,
			autoColors,
			{
				includeFallbackColors: true
			}
		);

		return result ? new Color(result) : Colors.black;
	}

	/**
	 * 単純グラデーションの作成
	 * @param start 開始色
	 * @param end 終了色
	 * @param count 色数
	 * @returns グラデーション配列
	 */
	public static generateGradient(start: Color, end: Color, count: number): Array<Color> {
		if (count <= 1) {
			throw new Error(`${count}`);
		}

		// RGB と HSL で処理できるようにした方がいいかも
		// RGB だと灰色がなぁ

		const a = start.raw.toRgb();
		const z = end.raw.toRgb();

		const result = new Array<Color>();

		for (let i = 0; i < count; i++) {
			const zp = (i / (count - 1)) * 100;
			const ap = 100 - zp;
			const color = new Color(new TinyColor({
				r: (a.r * ap / 100) + (z.r * zp / 100),
				g: (a.g * ap / 100) + (z.g * zp / 100),
				b: (a.b * ap / 100) + (z.b * zp / 100),
			}));
			result.push(color);
		}

		return result;
	}

	public analogous(count: number): Array<Color> {
		return this.raw.analogous(count).map(a => new Color(a));
	}

	public monochromatic(count: number): Array<Color> {
		return this.raw.monochromatic(count).map(a => new Color(a));
	}

	public static random(): Color {
		return new Color(random());
	}

	//#endregion
}

export abstract class Colors {
	public static white = Color.create(0xff, 0xff, 0xff);
	public static black = Color.create(0x00, 0x00, 0x00);
}
