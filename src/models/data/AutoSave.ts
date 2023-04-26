import { TimeSpan } from "@/models/TimeSpan";

export interface AutoSave {
	isEnabled: boolean;
	span: TimeSpan;
}
