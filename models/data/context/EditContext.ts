import { createContext } from 'react';
import { EditData } from '../EditData';

export interface EditContext {
	data: EditData;

	autoSave: {
		isEnabled: boolean,
		minutes: number,
	},

	debug: number;
}

export class EditContextImpl {
	public data: EditData;

	public autoSave = {
		isEnabled: false,
		minutes: 5,
	};

	public debug = 0;

	constructor(data: EditData) {
		this.data = data;
	}
}
export const EditContext = createContext<EditContext>(new EditContextImpl({} as EditData));
