import { AutoSave } from "@/models/data/AutoSave";
import { Design } from "@/models/data/Design";

/**
 * TODO: 不変データと変更データが混在中(いつか考える)。
 */
export interface Configuration {
	tabIndex: {
		application: number,
		setting: number,
	},
	autoSave: AutoSave;
	design: Design;
	workingDays: number;
}
