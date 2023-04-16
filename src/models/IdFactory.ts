import { v4 } from "uuid";

import { MemberId, TimelineId } from "./data/Setting";

/**
 * 何らかのID生成マシーン。
 */
export abstract class IdFactory {

	/**
	 * React 表示要素のキー生成。
	 * @returns
	 */
	public static createReactKey(): MemberId {
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
