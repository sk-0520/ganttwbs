
/**
 * チャートの基準領域。
 * 実際の描画領域はチャート側で定義する。
 */
export interface ChartArea {
	x: number;
	y: number;
	width: number;
	height: number;
}
