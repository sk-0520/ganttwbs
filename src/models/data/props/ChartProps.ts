import { ChartArea } from "@/models/data/ChartArea";
import { TimelineStore } from "@/models/store/TimelineStore";

import { ConfigurationProps } from "./ConfigurationProps";

export interface ChartProps extends ConfigurationProps {
	foreground: string;
	background: string;
	borderColor: string;
	borderThickness: number;
	area: ChartArea;
	timelineStore: TimelineStore;
}
