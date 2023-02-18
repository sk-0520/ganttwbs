import { MemberId, Member } from "./Member";

export interface Group {
	name: string;
	members: { [id: MemberId]: Member };
}
