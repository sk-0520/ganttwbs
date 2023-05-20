import { DateTime } from "@/models/DateTime";
import { Dom } from "@/models/Dom";
import { TimelineIdOrObject, Timelines } from "@/models/Timelines";

export abstract class Editors {

	/**
	 * 表示領域への移動。
	 * @param timeline
	 * @param date
	 */
	public static scrollView(timeline: TimelineIdOrObject | undefined, date: DateTime | undefined): void {
		if (!timeline && !date) {
			throw new Error();
		}

		const mainContentElement = Dom.querySelector(".tab-timeline");
		const crossHeaderElement = Dom.getElementById("cross-header");

		const columnElement = date ? Dom.getElementById(Timelines.toDaysId(date)) : undefined;
		const rowElement = timeline ? Dom.getElementById(Timelines.toRowId(timeline)) : undefined;

		const timelineSize = {
			width: mainContentElement.clientWidth - crossHeaderElement.clientWidth,
			height: mainContentElement.clientHeight - crossHeaderElement.clientHeight,
		};

		mainContentElement.scrollTo({
			left: columnElement
				? (
					0 < timelineSize.width
						? columnElement.offsetLeft - (timelineSize.width / 2)
						: columnElement.offsetLeft
				)
				: undefined
			,
			top: rowElement
				? (
					0 < timelineSize.height
						? rowElement.offsetTop - (timelineSize.height / 2)
						: rowElement.offsetTop
				)
				: undefined
			,
		});
	}

}
