import { AutoSave } from "./AutoSave";
import { Design } from "./Design";

export interface Editor {
	fileName: string;
	autoSave: AutoSave;
	design: Design;
}
