import { EditData } from "./data/EditData";

export abstract class Storage {

	public static saveEditData(editData: EditData) {
		const sessionData = JSON.stringify(editData);
		sessionStorage.setItem("data", sessionData);
	}

	public static loadEditData(): EditData | null {
		const sessionData = sessionStorage.getItem("data");
		if (!sessionData) {
			return null;
		}
		const settingObject = JSON.parse(sessionData);
		//TODO: 型チェック+バージョン確認 -> 読み込み処理できちんとやってから実装対応する
		const data = settingObject as EditData;
		return data;
	}

}
