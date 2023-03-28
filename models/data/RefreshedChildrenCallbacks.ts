
/**
 * 子が親に対して更新した旨を通知。
 */
export default interface RefreshedChildrenCallbacks {
	callbackRefreshChildrenBeginDate(): void;
	callbackRefreshChildrenWorkload(): void;
	callbackRefreshChildrenProgress(): void;
}
