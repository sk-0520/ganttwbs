import { DeepReadonly } from "ts-essentials";

import { Setting } from "@/models/data/Setting";

export interface SettingProps {
	readonly setting: DeepReadonly<Setting> ;
}
