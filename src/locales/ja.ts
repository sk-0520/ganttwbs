import { Locale } from "@/locales/locale";

const locale: Locale = {
	language: "日本語",

	common: {
		enabled: "有効",
		disabled: "無効",

		command: {
			add: "追加",
			remove: "削除",

			download: "ダウンロード",
			upload: "アップロード",

			copy: "コピー",
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
			save: {
				title: "保存設定",
				fileName: "ファイル名",

				auto: {
					title: "自動保存",

					columns: {
						kind: "対象",
						enabled: "実施",
						span: "間隔(分)",
						last: "前回",
						next: "次回",
					},

					storage: {
						kind: "ストレージ",
					},
					download: {
						kind: "ダウンロード",
						fileNameFormat: "${ORIGINAL_NAME}(自動保存-${TIMESTAMP}).${ORIGINAL_EXT}"
					},
				},

				export: {
					title: "出力",
				},
			},

			byebye: "さいなら",
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
			},
			timelines: {
				range: {
					immediate: {
						title: "即時実行",
						attachBeforeTimeline: "直近項目に紐づける",
					},
					continue: {
						title: "継続実行",
						attachBeforeTimeline: "直近項目に紐づける",
						clearRelation: "紐づけを解除",
						clearDate: "固定日付を解除",
					},
				},
				controls: {
					move: {
						title: "移動",
						up: "上へ",
						down: "下へ",
						parent: "下げる",
					},
					add: {
						title: "追加",
						group: "グループ",
						task: "タスク",
						import: "追加",
					},
					others: {
						title: "その他",
						setting: "詳細設定",
					},
				}
			},
			importDialog: {
				title: "タイムライン追加",
				subject: "グループ名",
				contents: "タスクタイムライン",
			},
			detailDialog: {
				title: "タイムライン設定",
				progressMinimum: "未対応",
				progressMaximum: "完了",
				comment: "作業",
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
