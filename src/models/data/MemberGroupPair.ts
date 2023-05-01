import { Group, Member } from "@/models/data/Setting";

export interface MemberGroupPair {
	group: Readonly<Group>;
	member: Member;
}
