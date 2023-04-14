import { DateTime } from "./DateTime";
import { TimeSpan } from "./TimeSpan";
import { CellBox } from "./data/CellBox";
import { ChartArea } from "./data/ChartArea";
import { ChartSize } from "./data/ChartSize";
import { TimeSpanRange } from "./data/TimeSpanRange";
import { SuccessWorkRange } from "./data/WorkRange";

export abstract class Charts {

	public static getTimeSpanRange(startDate: DateTime, workRange: SuccessWorkRange): TimeSpanRange {
		const startDiffTime = workRange.begin.getTime() - startDate.getTime();
		const startDiffSpan = TimeSpan.fromMilliseconds(startDiffTime);
		//const startDiffDays = startDiffSpan.totalDays;

		const endDiffTime = workRange.end.getTime() - workRange.begin.getTime();
		const endDiffSpan = TimeSpan.fromMilliseconds(endDiffTime);
		//const endDiffDays = endDiffSpan.totalDays;

		return {
			start: startDiffSpan,
			end: endDiffSpan,
		};
	}

	public static createChartArea(timeRange: TimeSpanRange, index: number, cell: CellBox, chartSize: ChartSize): ChartArea {
		const width = typeof cell.width === "number" ? cell.width : cell.width.value;
		const height = typeof cell.height === "number" ? cell.height : cell.height.value;

		const result: ChartArea = {
			x: timeRange.start.totalDays * width,
			y: index * height,
			width: timeRange.end.totalDays * width,
			height: height,
			chartSize: chartSize,
		};

		return result;
	}

}
