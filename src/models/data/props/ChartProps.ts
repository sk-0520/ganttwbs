import { ChartArea } from "../ChartArea";
import { ConfigurationProps } from "./ConfigurationProps";

export interface ChartProps extends ConfigurationProps {
	foreground: string;
	background: string;
	borderColor: string;
	borderThickness: number;
	area: ChartArea;
}
