import { NextRouter } from "next/router";

import { Storage } from "@/models/Storage";
import { EditorData } from "@/models/data/EditorData";

export abstract class Goto {

	public static editor(editData: EditorData, router: NextRouter): Promise<boolean> {
		Storage.saveEditorData(editData);
		return router.push("/editor");
	}

}

