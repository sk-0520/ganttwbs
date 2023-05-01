import { NextRouter } from "next/router";

import { EditorData } from "@/models/data/EditorData";
import { Storages } from "@/models/Storages";

/**
 * 画面遷移処理。
 */
export abstract class Goto {

	/**
	 * エディター(アプリ的に本体)に移動。
	 * @param editData
	 * @param router
	 * @returns
	 */
	public static editor(editData: EditorData, router: NextRouter): Promise<boolean> {
		Storages.saveEditorData(editData);
		return router.push("/editor");
	}

}

