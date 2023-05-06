import { As } from "@/models/As";
import { Color } from "@/models/Color";
import { PriceSetting } from "@/models/data/PriceSetting";
import { HolidayKind, TimelineTheme, WeekDay } from "@/models/data/Setting";

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

	public static readonly BusinessWeekdayColor = Color.parse("#000000");
	public static readonly UnknownMemberColor = Color.parse("#000000");

	/**
	 * 週定休日とその色を取得。
	 */
	public static getRegularHolidays(): { [K in WeekDay]?: Color } {
		return {
			"saturday": Color.parse("#babaff"),
			"sunday": Color.parse("#ffbaba"),
		};
	}

	/**
	 * 祝日の色を取得。
	 */
	public static getEventHolidayColors(): Record<HolidayKind, Color> {
		return {
			normal: Color.parse("#baffff"),
			special: Color.parse("#baffba"),
		};
	}

	public static getGroupThemeColors(): Array<Color> {
		return Color.generateGradient(Color.parse("#5555ee"), Color.parse("#80ff00"), 5);
	}

	public static getTimelineTheme(): TimelineTheme {
		const result: TimelineTheme = {
			defaultGroup: "#ee00ee",
			defaultTask: "#ffffba",
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
			workingDays: As.integer(process.env.NEXT_PUBLIC_RESOURCE_MONTH_WORKING_DAYS),

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
