import { EditorData } from "@/models/data/EditorData";

/**
 * 何かしらのストレージ処理。
 *
 * まぁブラウザ。
 */
export abstract class Storage {

	/**
	 * エディタ用データ保存。
	 * @param editorData
	 */
	public static saveEditorData(editorData: EditorData) {
		const sessionData = JSON.stringify(editorData);
		sessionStorage.setItem("editor", sessionData);
	}

	/**
	 * エディタ用データ読み込み。
	 * @returns あかんときは `null`。
	 */
	public static loadEditorData(): EditorData | null {
		const sessionData = sessionStorage.getItem("editor");
		if (!sessionData) {
			return null;
		}
		const settingObject = JSON.parse(sessionData);
		//TODO: 型チェック+バージョン確認 -> 読み込み処理できちんとやってから実装対応する
		const data = settingObject as EditorData;
		return data;
	}

}
