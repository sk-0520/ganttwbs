import { TinyColor, mostReadable } from "@ctrl/tinycolor";

import { Color } from "@/models/data/Setting";

export default abstract class Colors {

	public static getAutoColor(color: Color | TinyColor): TinyColor {
		const textColors = ["#000", "#fff"];
		const result = mostReadable(
			color,
			textColors,
			{
				includeFallbackColors: true
			}
		);

		return result ?? new TinyColor("#000");
	}

	/**
	 * 単純グラデーションの作成
	 * @param start 開始色
	 * @param end 終了色
	 * @param count 色数
	 * @returns グラデーション配列
	 */
	public static generateGradient(start: Color | TinyColor, end: Color | TinyColor, count: number): Array<TinyColor> {
		if (typeof start === "string") {
			start = new TinyColor(start);
		}
		if (typeof end === "string") {
			end = new TinyColor(end);
		}
		if (count <= 1) {
			throw new Error(`${count}`);
		}

		// RGB と HSL で処理できるようにした方がいいかも
		// RGB だと灰色がなぁ

		const a = start.toRgb();
		const z = end.toRgb();

		const result = new Array<TinyColor>();

		for (let i = 0; i < count; i++) {
			const zp = (i / (count - 1)) * 100;
			const ap = 100 - zp;
			const color = new TinyColor({
				r: (a.r * ap / 100) + (z.r * zp / 100),
				g: (a.g * ap / 100) + (z.g * zp / 100),
				b: (a.b * ap / 100) + (z.b * zp / 100),
			});
			result.push(color);
		}

		return result;
	}
}
