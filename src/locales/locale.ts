import { useRouter } from "next/router";

import ja from "@/locales/ja";
import { WeekDay } from "@/models/data/Setting";


export interface Locale {
	/** 言語名 */
	language: string,
	/** 共通項目 */
	common: {
		enabled: string,
		disabled: string,

		command: {
			add: string,
			remove: string,

			download: string,
			upload: string,

			copy: string,
		},

		dialog: {
			submit: string,
			cancel: string,
			close: string,
		},

		calendar: {
			week: {
				name: string,
				long: { [key in WeekDay]: string },
				short: { [key in WeekDay]: string },
			},

			format: {
				yearMonth: string,
			},
		},
	},

	page: {
		top: string,
		new: string,
		load: string,
		editor: string,
		about: string,
		aboutLibrary: string
	},

	editor: {
		tabs: {
			file: string,
			timeline: string,
			setting: string,
		},

		loading: string,

		file: {
			save: {
				title: string,
				fileName: string,

				auto: {
					title: string,

					columns: {
						kind: string,
						enabled: string,
						span: string,
						last: string,
						next: string,
					},

					storage: {
						kind: string,
					},
					download: {
						kind: string,
						/**
						 * 自動ダウンロードで使用するファイル名。
						 *
						 * 以下プレースホルダーの置き換えが行われる。
						 * * ORIGINAL
						 * * ORIGINAL_NAME
						 * * ORIGINAL_EXT
						 * * TIMESTAMP
						 */
						fileNameFormat: string,
					}
				},

				export: {
					title: string,
				},
			},
			byebye: string
		},
		timeline: {
			header: {
				operations: {
					addNewGroupTimeline: string,
					addNewTaskTimeline: string,
					importTimelines: string,
					navigateFirst: string,
					navigateToday: string,
					navigateLast: string,
				},
				columns: {
					id: string,
					subject: string,
					workload: string,
					resource: string,
					relation: string,
					workRangeFrom: string,
					workRangeTo: string,
					workRangeError: string,
					progress: string,
					controls: string,
				},
			},
			workRange: {
				kind: {
					loading: string,
					noInput: string,
					selfSelectedError: string,
					noChildren: string,
					relationNoInput: string,
					relationError: string,
					recursiveError: string,
					unknownError: string,
				}
			},
			timelines: {
				range: {
					immediate: {
						title: string,
						attachBeforeTimeline: string,
					},
					continue: {
						title: string,
						attachBeforeTimeline: string,
						clearRelation: string,
						clearDate: string,
					},
				},
				controls: {
					move: {
						title: string,
						up: string,
						down: string,
						parent: string,
					},
					add: {
						title: string,
						group: string,
						task: string,
						import: string,
					},
					others: {
						title: string,
						setting: string,
					},
				}
			},
			// views: {
			// },
		},
		setting: {
			tabs: {
				general: string,
				resource: string,
				calendar: string,
				theme: string,
			}
		},
	},

	styles: {
		editor: {
			fontFamilies: Array<string>,
		},
	},
}

export function useLocale(): Locale {
	const router = useRouter();
	let locale: Locale | null = null;

	if (router.locale === "ja") {
		locale = ja;
	} else {
		locale = ja;
	}

	return locale;
}
