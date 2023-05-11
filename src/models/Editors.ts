import { DateTime } from "@/models/DateTime";
import { Dom } from "@/models/Dom";
import { TimelineIdOrObject, Timelines } from "@/models/Timelines";

export abstract class Editors {

	public static scrollView(timeline: TimelineIdOrObject | undefined, date: DateTime | undefined): void {
		const mainContentElement = document.querySelector(".tab-timeline");
		if (!mainContentElement) {
			return;
		}

		const columnElement = date ? Dom.getElementById(Timelines.toDaysId(date)) : undefined;
		const rowElement = timeline ? Dom.getElementById(Timelines.toRowId(timeline)) : undefined;

		mainContentElement.scrollTo({
			left: columnElement?.offsetLeft,
			top: rowElement?.offsetTop,
		});
	}

}
