import { ChartSize } from "./ChartSize";
import { TimeSpanRange } from "./TimeSpanRange";

/**
 * チャートの基準領域。
 * 実際の描画領域はチャート側で定義する。
 */
export interface ChartArea {
	/** 描画領域の算出に用いた日範囲, `null` だと算出失敗 */
	timeSpanRange: TimeSpanRange | null;
	x: number;
	y: number;
	width: number;
	height: number;
	chartSize: ChartSize;
}
