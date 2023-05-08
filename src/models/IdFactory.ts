import { v4 } from "uuid";

import { MemberId, TimelineId } from "@/models/data/Setting";

/**
 * 何らかのID生成マシーン。
 */
export abstract class IdFactory {

	public static readonly rootTimelineId = "00000000-0000-0000-0000-000000000000";

	/**
	 * React 表示要素のキー生成。
	 * @returns
	 */
	public static createReactKey(): MemberId {
		return v4();
	}

	/**
	 * グループID生成。
	 * @returns
	 */
	public static createGroupId(): MemberId {
		return v4();
	}

	/**
	 * メンバーID生成。
	 * @returns
	 */
	public static createMemberId(): MemberId {
		return v4();
	}

	/**
	 * タイムラインID生成。
	 * @returns
	 */
	public static createTimelineId(): TimelineId {
		return v4();
	}
}
