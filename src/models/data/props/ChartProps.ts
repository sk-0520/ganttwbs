import type { ChartArea } from "@/models/data/ChartArea";
import type { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import type { Progress } from "@/models/data/Setting";
import type { TimelineCallbacks } from "@/models/data/TimelineCallbacks";

export interface ChartProps extends ConfigurationProps {
	foreground: string;
	background: string;
	borderColor: string;
	borderThickness: number;
	area: ChartArea;
	progress: Progress;
	timelineStore: TimelineCallbacks;
}
