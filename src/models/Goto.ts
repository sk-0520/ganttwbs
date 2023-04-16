import { NextRouter } from "next/router";

import { EditorData } from "@/models/data/EditorData";
import { Storage } from "@/models/Storage";

export abstract class Goto {

	public static editor(editData: EditorData, router: NextRouter): Promise<boolean> {
		Storage.saveEditorData(editData);
		return router.push("/editor");
	}

}

