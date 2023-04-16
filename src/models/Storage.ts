import { EditorData } from "./data/EditorData";

export abstract class Storage {

	public static saveEditorData(editorData: EditorData) {
		const sessionData = JSON.stringify(editorData);
		sessionStorage.setItem("editor", sessionData);
	}

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
