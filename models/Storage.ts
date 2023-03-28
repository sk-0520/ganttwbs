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
		// 型チェック
		const data = settingObject as EditData;
		return data;
	}

}
