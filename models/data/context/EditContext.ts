import { createContext } from "react";

import { EditData } from "../EditData";

export interface EditContext {
	data: EditData;

	autoSave: {
		isEnabled: boolean;
		minutes: number;
	};

	design: {
		cell: {
			maxWidth: string;
			minWidth: string;
			maxHeight: string;
			minHeight: string;
		}
	}

	debug: number;
}

export class EditContextImpl {
	public data: EditData;

	public autoSave = {
		isEnabled: false,
		minutes: 5,
	};

	public design = {
		cell: {
			maxWidth: "20px",
			minWidth: "20px",
			maxHeight: "20px",
			minHeight: "20px",
		}
	};

	public debug = 0;

	constructor(data: EditData) {
		this.data = data;
	}
}
export const EditContext = createContext<EditContext>(new EditContextImpl({} as EditData));
