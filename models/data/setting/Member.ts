import { Color } from "./Color";

export type MemberId = string;

export interface Member {
	id: MemberId;
	name: string;
	color: Color;
}
