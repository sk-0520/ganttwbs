import { DateTime } from "@/models/DateTime";
import { Dom } from "@/models/Dom";
import { TimelineIdOrObject, Timelines } from "@/models/Timelines";
import { Types } from "@/models/Types";

export abstract class Editors {

	/**
	 * 表示領域への移動。
	 *
	 * なるべく中央に表示しようとする。
	 *
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

	/**
	 * タイムライン編集部を表示。
	 *
	 * 中央表示とか難しいことはしない。
	 *
	 * @param timeline
	 */
	public static scrollTimeline(timeline: TimelineIdOrObject): void {
		const mainContentElement = Dom.querySelector(".tab-timeline");
		const crossHeaderElement = Dom.getElementById("cross-header");

		const rowElement = Dom.getElementById(Timelines.toRowId(timeline));

		console.log({
			rowElement: rowElement.offsetTop,
			mainContentElement_clientHeight: mainContentElement.clientHeight,
			mainContentElement_scrollTop: mainContentElement.scrollTop,
		});

		let top: number | undefined = undefined;
		const height = mainContentElement.scrollTop + mainContentElement.clientHeight - crossHeaderElement.clientHeight;
		if ((height - rowElement.clientHeight) < rowElement.offsetTop) {
			top =  mainContentElement.scrollTop + rowElement.clientHeight * 2;
		} else if(rowElement.offsetTop < mainContentElement.scrollTop) {
			top =  mainContentElement.scrollTop - rowElement.clientHeight * 2;
		}

		if (Types.isNumber(top)) {
			mainContentElement.scrollTo({
				top: top,
			});
		}


		//rowElement.offsetTop +

		// const timelineSize = {
		// 	height: mainContentElement.clientHeight - crossHeaderElement.clientHeight,
		// };

		// mainContentElement.scrollTo({
		// 	top: rowElement
		// 		? (
		// 			0 < timelineSize.height
		// 				? rowElement.offsetTop - timelineSize.height
		// 				: rowElement.offsetTop
		// 		)
		// 		: undefined
		// 	,
		// });
	}



}
