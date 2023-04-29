import { TimeSpan } from "@/models/TimeSpan";

export interface AutoSave {
	/** ストレージへの保存設定 */
	storage: {
		isEnabled: boolean,
		time: TimeSpan,
	},
	/** ダウンロード設定 */
	download: {
		isEnabled: boolean,
		time: TimeSpan,
	},
}
