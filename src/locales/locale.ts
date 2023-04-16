import { useRouter } from "next/router";
import { WeekDay } from "@/models/data/Setting";

import ja from "./ja";

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
