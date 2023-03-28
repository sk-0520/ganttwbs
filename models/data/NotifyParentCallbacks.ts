import { DragEvent } from "react";
import { MoveItemKind } from "@/components/elements/edit/timeline/TimelineControls";
import { GroupTimeline, TaskTimeline, Timeline } from "./Setting";

/**
 * 親に対して子が操作を通知
 */
export default interface NotifyParentCallbacks {
	callbackRefreshChildrenOrder: (kind: MoveItemKind, currentTimeline: Timeline) => void;
	callbackDeleteChildTimeline(currentTimeline: Timeline): void;
	callbackDraggingTimeline(event: DragEvent, sourceTimeline: GroupTimeline | TaskTimeline): void;
}
