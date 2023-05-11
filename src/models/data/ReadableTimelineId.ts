export interface ReadableTimelineId {
	/** 最上位が0(RootTimeline)となるため原則1からの開始となる。 */
	readonly level: number;
	/** 自身IDまでのツリー。 */
	readonly tree: ReadonlyArray<number>;
}
