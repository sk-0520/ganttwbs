import { Locale } from "@/locales/locale";

const locale: Locale = {
	language: "日本語",
	common: {

		command: {
			add: "追加",
			remove: "削除",
		},

		calendar: {
			week: {
				name: "曜日",
				long: {
					"monday": "月曜日",
					"tuesday": "火曜日",
					"wednesday": "水曜日",
					"thursday": "木曜日",
					"friday": "金曜日",
					"saturday": "土曜日",
					"sunday": "日曜日",
				},
				short: {
					"monday": "月",
					"tuesday": "火",
					"wednesday": "水",
					"thursday": "木",
					"friday": "金",
					"saturday": "土",
					"sunday": "日",
				},
			},

			format: {
				yearMonth: "yyyy/MM"
			}
		}
	},

	styles: {
		editor: {
			fontFamilies: [
				"MigMix 1M",
				"MS ゴシック",
			]
		}
	}
};

export default locale;
