import { Locale } from "@/locales/locale";

const locale: Locale = {
	language: "日本語",

	common: {

		command: {
			add: "追加",
			remove: "削除",
		},

		dialog: {
			submit: "OK",
			cancel: "キャンセル",
			close: "閉じる",
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
		},
	},

	page: {
		top: "トップ",
		new: "新規",
		load: "読み込み",
		editor: "編集",
		about: "なにこれ？",
		aboutLibrary: "ライブラリ",
	},

	editor: {
		tabs: {
			file: "ファイル",
			timeline: "タイムライン",
			setting: "設定",
		},

		loading: "なうろ",

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
			header: {
				operations: {
					addNewGroupTimeline: "グループ追加",
					addNewTaskTimeline: "タスク追加",
					importTimelines: "タイムライン追加",
					navigateFirst: "先頭",
					navigateToday: "けふ",
					navigateLast: "最終",
				},
				columns: {
					id: "ID",
					subject: "作業",
					workload: "工数",
					resource: "割当",
					relation: "💩",
					workRangeFrom: "開始",
					workRangeTo: "終了",
					workRangeError: "あかん",
					progress: "進捗率",
					controls: "操作",
				},
			},
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

		setting: {
			tabs: {
				general: "基本",
				resource: "リソース",
				calendar: "カレンダー",
				theme: "テーマ",
			}
		}

	},

	styles: {
		editor: {
			fontFamilies: [
				"MigMix 1M",
				"Consolas",
				"MS Gothic",
			]
		}
	}
};

export default locale;
