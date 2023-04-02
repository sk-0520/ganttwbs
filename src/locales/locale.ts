import { useRouter } from "next/router";
import { WeekDay } from "../models/data/Setting";

import ja from "./ja";

export interface Locale {
	language: string;
	common: {
		add: string;
		remove: string;
	},
	calendar: {
		week: {
			name: string,
			long: { [key in WeekDay]: string };
			short: { [key in WeekDay]: string };
		};
	}
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
