import { NextRouter } from "next/router";

import * as Storage from "@/models/Storage";
import { EditData } from "@/models/data/EditData";

export default class Goto {

	public static edit(editData: EditData, router: NextRouter): Promise<boolean> {
		Storage.saveEditData(editData);
		return router.push("/edit");
	}

}

