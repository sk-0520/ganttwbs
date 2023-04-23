import { Group, Member } from "@/models/data/Setting";

export interface MemberMapValue {
	group: Readonly<Group>;
	member: Member;
}
