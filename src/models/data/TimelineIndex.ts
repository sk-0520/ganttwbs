export interface TimelineIndex {
	/** 最上位が0(RootTimeline)となるため原則1からの開始となる。 */
	level: number;
	/** 自身IDまでのツリー。 */
	tree: Array<number>;
}
