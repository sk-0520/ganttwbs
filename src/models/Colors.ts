import { TinyColor, mostReadable, random } from "@ctrl/tinycolor";

import { Color } from "@/models/Color";

export abstract class Colors {
	public static white = Color.create(0xff, 0xff, 0xff);
	public static black = Color.create(0x00, 0x00, 0x00);

	/**
	 * 指定の色に対して読みやすい(?)色を取得
	 * @param color
	 * @returns
	 */
	public static getAutoColor(color: Color): Color {
		const autoColors = [this.black, this.white];
		const result = mostReadable(
			color,
			autoColors,
			{
				includeFallbackColors: true
			}
		);

		return result ? new Color(result) : this.black;
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

	public static analogous(base: Color, count: number): Array<Color> {
		return base.raw.analogous(count).map(a => new Color(a));
	}

	public static monochromatic(base: Color, count: number): Array<Color> {
		return base.raw.monochromatic(count).map(a => new Color(a));
	}

	public static random(): Color {
		return new Color(random());
	}

}
