import { useRouter } from "next/router";

import ja from "@/locales/ja";
import { WeekDay } from "@/models/data/Setting";


export interface Locale {
	/** 言語名 */
	language: string;
	/** 共通項目 */
	common: {
		command: {
			add: string;
			remove: string;
		};

		calendar: {
			week: {
				name: string,
				long: { [key in WeekDay]: string };
				short: { [key in WeekDay]: string };
			};

			format: {
				yearMonth: string;
			};
		}
	};
	timeline: {
		workRange: {
			kind: {
				loading: string;
				noInput: string;
				selfSelectedError: string;
				noChildren: string;
				relationNoInput: string;
				relationError: string;
				recursiveError: string;
				unknownError: string;
			}
		}
	}
	styles: {
		editor: {
			fontFamilies: Array<string>;
		};
	};
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
