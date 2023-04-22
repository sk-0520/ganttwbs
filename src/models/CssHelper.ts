import { Strings } from "@/models/Strings";

export abstract class CssHelper {

	public static toFontFamily(families: ReadonlyArray<string>): string {
		return families
			.map(a => Strings.trim(a))
			.map(a => a.includes(" ") ? `'${a}'`: a)
			.join(",")
		;
	}

}
