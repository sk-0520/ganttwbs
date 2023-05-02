import { DateTime } from "@/models/DateTime";
import { TimelineIdOrObject, Timelines } from "@/models/Timelines";

export abstract class Editors {

	public static scrollView(timeline: TimelineIdOrObject | undefined, date: DateTime | undefined): void {
		const mainContentElement = document.querySelector(".tab-timeline");
		if (!mainContentElement) {
			return;
		}

		const columnElement = date ? document.getElementById(Timelines.toDaysId(date)) : undefined;
		const rowElement = timeline ? document.getElementById(Timelines.toRowId(timeline)) : undefined;

		mainContentElement.scrollTo({
			left: columnElement?.offsetLeft,
			top: rowElement?.offsetTop,
		});
	}

}
