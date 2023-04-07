import { TinyColor, mostReadable } from "@ctrl/tinycolor";
import { Color } from "react-color";

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
}
