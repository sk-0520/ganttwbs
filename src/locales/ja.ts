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
			timeZone: "タイムゾーン",

			unit: {
				month: "月",
				day: "日",
				holiday: "祝日",
			},

			holiday: {
				name: "祝日",
				normal: "通常",
				special: "特殊",
			},

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

			yearMonthFormat: "yyyy/MM",
		},
	},

	pages: {
		top: {
			title: "トップ",
		},
		new: {
			title: "新規",

			description: "ここで入力する内容は編集時に変更可能です。",
			projectName: "タイトル",

			range: {
				title: "範囲",

				beginYear: "開始年",
				beginMonth: "開始月",
				monthCount: "月数",
			},

			mode: {
				title: "作成方法",
				empty: "空データ",
				sample: "サンプル",
			},

			submit: "作業開始",
		},
		load: {
			title: "読み込み",
		},
		editor: {
			title: "編集",

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
				},

				general: {
					projectName: "タイトル",
					recursive: "反復計算数",
					selectCurrentTimeZoneFormat: "現在のタイムゾーン(${TIMEZONE})"
				},

				resource: {
					groupName: "グループ名",
					choiceColor: "色を割り振り",
					newGroup: "新規グループ",

					columns: {
						memberName: "要員名",
						costFormat: "原価(${UNIT})",
						salesFormat: "単価(${UNIT})",
						theme: "テーマ",
						rate: "売上率",
					},

					choiceColorDialog: {
						title: "色選択",
						baseColor: "基準色",
						gradientColor: "グラデーション",
						resetRandomColor: "ランダム再構築",

						kinds: {
							same: "同じ",
							analogy: "類似",
							monochrome: "モノクロ",
							gradient: "グラデーション",
							random: "ランダム",
						},
					}
				},

				calendar: {

					range: {
						title: "日付範囲",
						begin: "開始",
						end: "終了",
					},

					week: {
						title: "曜日設定",
					},

					holiday: {
						title: "祝日",
						description: "以下の形式で祝日を入力してください。",
						example: "YYYY-MM-DD<TAB>説明",

						normal: {
							description: "国などが定める通常の祝日を設定してください。",
						},
						special: {
							description: "会社の年末年始・夏季休暇などを設定してください。通常の祝日と重複する場合、こちらが優先されます。",
						},
					},

				},

				theme: {
					calendar: {
						title: "カレンダー",
					},

					group: {
						title: "グループ",

						levelFormat: "レベル ${LEVEL}",
						collectiveSetting: "一括設定",
						collectiveSettingDialog: {
							title: "一括設定",
							countInfinity: "件数(無限)",
							countFiniteFormat: "件数(${COUNT})",
							color: "色",
						},
					},

					timeline: {
						title: "タイムライン",

						defaultGroup: "未設定グループ",
						defaultTask: "未設定タスク",
						completed: "完了",
					},
				},
			},
		},
		about: {
			title: "なにこれ？",
		},
		aboutLibrary: {
			title: "ライブラリ",
		},
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
