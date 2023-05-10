import { TimeSpan } from "@/models/TimeSpan";

export const enum AutoSaveKind {
	Storage,
	Download,
}

interface AutoSaveState {
	//TODO: 状態として切り分け
	isEnabled: boolean,
	//TODO: 状態として切り分け
	time: TimeSpan,
	readonly step: number;
}

export interface AutoSave {
	/** ストレージへの保存設定 */
	storage: AutoSaveState,
	/** ダウンロード設定 */
	download: AutoSaveState,
}
