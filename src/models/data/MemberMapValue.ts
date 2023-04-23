import { Group, Member } from "@/models/data/Setting";
import { DeepReadonly } from "ts-essentials";

export interface MemberMapValue {
	group: DeepReadonly<Group>;
	member: Member;
}
