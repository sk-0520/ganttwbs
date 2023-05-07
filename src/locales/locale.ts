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
			timeZone: string,

			unit: {
				month: string,
				day: string,
				holiday: string,
			},

			holiday: {
				name: string,
				normal: string,
				special: string,
			},

			week: {
				name: string,
				long: { [key in WeekDay]: string },
				short: { [key in WeekDay]: string },
			},

			/** DateTime.format */
			yearMonthFormat: string,
			dateOnlyFormat: string,
		},

		timeline: {
			total: string,
			group: string,
			task: string,
		}
	},

	/** 各ページ項目 */
	pages: {
		top: {
			title: string,
		},
		new: {
			title: string,

			description: string,
			projectName: string,

			range: {
				title: string,

				beginYear: string,
				beginMonth: string,
				monthCount: string,
			},

			mode: {
				title: string,

				empty: string,
				sample: string,
			}

			submit: string,
		},
		load: {
			title: string,
		},
		editor: {
			title: string,

			tabs: {
				file: string,
				timeline: string,
				analytics: string,
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
				information: {
					memberDuplication: string,
					timelineAffected: string,
					/**
					 * * MEMBER
					 * * GROUP
					 */
					memberFormat: string,
				},
				header: {
					operations: {
						addNewGroupTimeline: string,
						addNewTaskTimeline: string,
						importTimelines: string,

						calendarFirst: string,
						calendarToday: string,
						calendarLast: string,

						informationFirst: string,
						informationList: string,
						informationLast: string,
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
					dummy: string,
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
				informationDialog: {
					title: string,
				},
				importDialog: {
					title: string,
					subject: string,
					contents: string,
				},
				detailDialog: {
					title: string,
					progressMinimum: string,
					progressMaximum: string,
					comment: string,
				}
				// views: {
				// },
			},
			setting: {
				tabs: {
					general: string,
					resource: string,
					calendar: string,
					theme: string,
				},

				save: string;

				general: {
					projectName: string,
					recursive: string,
					timeZoneKind:{
						name: string,
						offset: string,
					},
					selectCurrentTimeZoneFormat: string,
				},

				resource: {
					groupName: string,
					choiceColor: string,
					newGroup: string,
					newMember: string,

					columns: {
						memberName: string,
						/**
						 * * UNIT
						 */
						costFormat: string,
						/**
						 * * UNIT
						 */
						salesFormat: string,
						theme: string,
						rate: string,
					},

					choiceColorDialog: {
						title: string,
						baseColor: string,
						gradientColor: string,
						resetRandomColor: string,

						kinds: {
							same: string,
							analogy: string,
							monochrome: string,
							gradient: string,
							random: string,
						},
					}
				},

				calendar: {

					range: {
						title: string,
						begin: string,
						end: string,
					},

					week: {
						title: string,
					},

					holiday: {
						title: string,
						description: string,
						example: string,

						normal: {
							description: string,
						},
						special: {
							description: string,
						},
					},

				},

				theme: {
					calendar: {
						title: string,
					},

					group: {
						title: string,
						/**
						 * * LEVEL
						 */
						levelFormat: string,
						collectiveSetting: string,
						collectiveSettingDialog: {
							title: string,
							countInfinity: string,
							/**
							 * * COUNT
							 */
							countFiniteFormat: string,
							color: string,
						},
					},

					timeline: {
						title: string,

						defaultGroup: string,
						defaultTask: string,
						completed: string,
					},
				},
			},
		},
		about: {
			title: string,
		},
		aboutLibrary: {
			title: string,
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
