import { DragEvent } from "react";

import { Timeline } from "@/models/data/Setting";

export interface DraggingTimeline {
	sourceTimeline: Timeline;
	onDragEnd(event: DragEvent): void;
	onDragEnter(event: DragEvent, targetTimeline: Timeline): void;
	onDragOver(event: DragEvent, targetTimeline: Timeline, callback: (draggingTimeline: DraggingTimeline) => void): void;
	onDragLeave(event: DragEvent, targetTimeline: Timeline, callback: (draggingTimeline: DraggingTimeline) => void): void;
	onDrop(event: DragEvent, targetTimeline: Timeline): void;
}
