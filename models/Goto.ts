import { NextRouter } from "next/router";

import { Storage } from "@/models/Storage";
import { EditData } from "@/models/data/EditData";

export abstract class Goto {

	public static edit(editData: EditData, router: NextRouter): Promise<boolean> {
		Storage.saveEditData(editData);
		return router.push("/edit");
	}

}

