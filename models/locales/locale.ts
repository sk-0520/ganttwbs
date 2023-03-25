import { useRouter } from "next/router";
import { WeekDay } from "../data/Setting";

import ja from "./ja";

export interface Locale {
	language: string;
	calendar: {
		week: {
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
