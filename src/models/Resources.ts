import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { ResourceInfo } from "@/models/data/ResourceInfo";
import { Group, Member, MemberId } from "@/models/data/Setting";

export abstract class Resources {

	public static createResourceInfo(groups: ReadonlyArray<Group>): ResourceInfo {
		const memberMap = new Map<MemberId, MemberGroupPair>();
		const memberItems = new Map<Group, Array<Member>>();

		for (const group of groups) {
			for (const member of group.members) {
				memberMap.set(member.id, { group: group, member: member });
			}

			memberItems.set(group, [...group.members].sort((a, b) => a.name.localeCompare(b.name)));
		}

		const result: ResourceInfo = {
			memberMap: memberMap,
			groupItems: [...groups].sort((a, b) => a.name.localeCompare(b.name)),
			memberItems: memberItems,
		};
		return result;
	}

}
