import { DragEvent } from "react";
import { GroupTimeline, TaskTimeline, Timeline } from "./Setting";

/**
 * 親に対して子が操作を通知
 */
export interface NotifyParentCallbacks {
	notifyMove: (moveUp: boolean, currentTimeline: Timeline) => void;
	notifyDragStart(event: DragEvent, sourceTimeline: GroupTimeline | TaskTimeline): void;
}
