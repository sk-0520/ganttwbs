import { DeepReadonly } from "ts-essentials";

import { Group, Member } from "@/models/data/Setting";

export interface MemberMapValue {
	group: DeepReadonly<Group>;
	member: Member;
}
