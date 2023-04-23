import { DeepReadonly } from "ts-essentials";

import { Configuration } from "@/models/data/Configuration";

export interface ConfigurationProps {
	readonly configuration: DeepReadonly<Configuration>;
}
