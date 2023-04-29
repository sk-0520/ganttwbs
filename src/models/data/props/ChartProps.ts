import { ChartArea } from "@/models/data/ChartArea";
import { Progress } from "@/models/data/Setting";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStore } from "@/models/store/TimelineStore";


export interface ChartProps extends ConfigurationProps {
	foreground: string;
	background: string;
	borderColor: string;
	borderThickness: number;
	area: ChartArea;
	progress: Progress;
	timelineStore: TimelineStore;
}
