import { MoveItemKind } from "@/components/elements/edit/timeline/TimelineControls";
import { Timeline } from "./Setting";

/**
 * 親に対して子が操作を要求
 */
export default interface NotifyParentCallbacks {
	callbackRefreshChildrenOrder: (kind: MoveItemKind, currentTimeline: Timeline) => void;
	callbackDeleteChildTimeline(currentTimeline: Timeline): void;
}
