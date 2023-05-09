import { CellDesign } from "@/models/data/Design";

/**
 * 描画全領域。
 *
 * ダミー領域は含まない。
 */
export interface AreaSize {
	width: number;
	height: number;
}

/**
 * 描画全領域と計算の元になったデータ。
 *
 * ダミー領域は含まない。
 */
export interface AreaData {
	cell: CellDesign;
	days: number;
	size: AreaSize;
}
