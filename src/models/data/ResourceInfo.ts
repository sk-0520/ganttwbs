import type { MemberGroupPair } from "@/models/data/MemberGroupPair";
import type { Group, Member, MemberId } from "@/models/data/Setting";

export interface ResourceInfo {
	/** メンバーIDとメンバー・グループのマッピング */
	memberMap: ReadonlyMap<MemberId, MemberGroupPair>;
	/** ソート済みグループ一覧 */
	groupItems: ReadonlyArray<Group>;
	/** グループに対するソート済みメンバー一覧 */
	memberItems: ReadonlyMap<Group, ReadonlyArray<Member>>;
}
