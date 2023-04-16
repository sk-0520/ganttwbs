import { createContext } from "react";

import { EditorData } from "../EditorData";

export interface EditContext {
	data: EditorData;

	autoSave: {
		isEnabled: boolean;
		minutes: number;
	};
}

export class EditContextImpl {
	public data: EditorData;

	public autoSave = {
		isEnabled: false,
		minutes: 5,
	};

	public debug = 0;

	constructor(data: EditorData) {
		this.data = data;
	}
}
export const EditContext = createContext<EditContext>(new EditContextImpl({} as EditorData));
