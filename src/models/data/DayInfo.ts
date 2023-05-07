import { MemberId, TimelineId } from "@/models/data/Setting";

export interface DayInfo {
	/** 重複メンバーID */
	duplicateMembers: Set<MemberId>;
	/** 該当タイムラインID(それがどの情報に含まれているかは判別不能,そこまで考えるのつらい) */
	targetTimelines: Set<TimelineId>;
}
