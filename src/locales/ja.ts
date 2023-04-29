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

	editor: {
		file: {
			autoSave: {
				storage: {
					kind: "ストレージ",
				},
				download: {
					kind: "ダウンロード",
					fileNameFormat: "${ORIGINAL_NAME}(自動保存-${TIMESTAMP}).${ORIGINAL_EXT}"
				},
			}
		},

		timeline: {
			workRange: {
				kind: {
					loading: "読み込み中",
					noInput: "未入力",
					selfSelectedError: "自身を選択",
					noChildren: "子タイムラインなし",
					relationNoInput: "関係タイムライン未入力",
					relationError: "関係タイムラインエラー",
					recursiveError: "反復計算エラー",
					unknownError: "エラー",
				}
			}
		},
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
