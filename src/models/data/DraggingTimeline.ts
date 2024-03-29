import { DragEvent } from "react";

import { AnyTimeline } from "@/models/data/Setting";

export interface DraggingTimeline {
	sourceTimeline: AnyTimeline;
	onDragEnd(event: DragEvent): void;
	onDragEnter(event: DragEvent, targetTimeline: AnyTimeline): void;
	onDragOver(event: DragEvent, targetTimeline: AnyTimeline): void;
	onDragLeave(event: DragEvent, targetTimeline: AnyTimeline): void;
	onDrop(event: DragEvent, targetTimeline: AnyTimeline): void;
}
