import type { TimeSpan } from "@/models/TimeSpan";

export enum AutoSaveKind {
	Storage = 0,
	Download = 1,
}

interface AutoSaveState {
	//TODO: 状態として切り分け
	isEnabled: boolean;
	//TODO: 状態として切り分け
	time: TimeSpan;
	readonly step: number;
}

export interface AutoSave {
	/** ストレージへの保存設定 */
	storage: AutoSaveState;
	/** ダウンロード設定 */
	download: AutoSaveState;
}
