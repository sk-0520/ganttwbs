import { TimeSpan } from "@/models/TimeSpan";

export const enum AutoSaveKind {
	Storage,
	Download,
}

interface AutoSaveState {
	isEnabled: boolean,
	time: TimeSpan,
	readonly step: number;
}

export interface AutoSave {
	/** ストレージへの保存設定 */
	storage: AutoSaveState,
	/** ダウンロード設定 */
	download: AutoSaveState,
}
