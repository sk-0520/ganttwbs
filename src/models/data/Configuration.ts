import { AutoSave } from "@/models/data/AutoSave";
import { Design } from "@/models/data/Design";

export interface Configuration {
	autoSave: AutoSave;
	design: Design;
}
