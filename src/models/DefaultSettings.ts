import Colors from "./data/Colors";
import { Color, HolidayKind, TimelineTheme, WeekDay } from "./data/Setting";

/**
 * 設定項目の初期値。
 */
export abstract class DefaultSettings {

	/**
	 * 反復計算最大数。
	 */
	public static readonly RecursiveMaxCount = 1000;
	/**
	 * 最新の設定ファイルバージョン。
	 */
	public static readonly SettingVersion = 0;

	/**
	 * 週定休日とその色を取得。
	 */
	public static getRegularHolidays(): Map<WeekDay, Color> {
		return new Map([
			["saturday", "#babaff"],
			["sunday", "#ffbaba"],
		]);
	}

	/**
	 * 祝日の色を取得。
	 */
	public static getEventHolidayColors(): Record<HolidayKind, Color> {
		return {
			holiday: "#ffbaba",
			special: "#baffba",
		}
	}

	public static getGroupThemeColors(): Array<Color> {
		return Colors.generateGradation("#5555ee", "#80ff00", 5).map(a => a.toHexString());
	}

	public static getTimelineTheme(): TimelineTheme {
		const result: TimelineTheme = {
			group: "#ff00ff",
			defaultGroup: "#ff0000",
			defaultTask: "#00ff00",
			completed: "#000000"
		};

		return result;
	}

	public static getPriceSetting() {
		return {
			input: {
				minimum: 1000,
				maximum: undefined,
				step: 1000,
			},
			price: {
				cost: 40000,
				sales: 50000,
			}
		}
	}

}
