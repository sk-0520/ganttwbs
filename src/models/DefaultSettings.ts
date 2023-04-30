import { As } from "@/models/As";
import { Colors } from "@/models/Colors";
import { PriceSetting } from "@/models/data/PriceSetting";
import { Color, HolidayKind, TimelineTheme, WeekDay } from "@/models/data/Setting";

/**
 * 設定項目の初期値。
 *
 * 完全な定数ではなく環境変数からもデータ取得を行うが外から見たら定数。
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

	public static readonly BusinessWeekdayColor = "#000000";

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
			holiday: "#ffffba",
			special: "#baffba",
		};
	}

	public static getGroupThemeColors(): Array<Color> {
		return Colors.generateGradient("#5555ee", "#80ff00", 5).map(a => a.toHexString());
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

	public static getPriceSetting(): PriceSetting {
		let inputMax: number | undefined = As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_INPUT_MAXIMUM);
		if (inputMax <= 0) {
			inputMax = undefined;
		}

		return {
			input: {
				cost: {
					minimum: As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_INPUT_MINIMUM),
					maximum: inputMax,
					step: As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_INPUT_STEP),
				},
				sales: {
					minimum: As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_INPUT_MINIMUM),
					maximum: inputMax,
					step: As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_INPUT_STEP),
				}
			},
			price: {
				cost: As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_DEFAULT_COST),
				sales: As.integer(process.env.NEXT_PUBLIC_RESOURCE_GROUP_MEMBER_PRICE_DEFAULT_SALES),
			}
		};
	}

}
