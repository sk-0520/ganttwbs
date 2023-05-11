
import { FC, useCallback, useMemo, KeyboardEvent } from "react";

import AnyTimelineEditor from "@/components/elements/pages/editor/timeline/AnyTimelineEditor";
import { Arrays } from "@/models/Arrays";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { IdFactory } from "@/models/IdFactory";
import { AnyTimeline } from "@/models/data/Setting";
import { Require } from "@/models/Require";
import { Timelines } from "@/models/Timelines";
import { Dom } from "@/models/Dom";
import { useSetAtom } from "jotai";
import { HighlightTimelineIdsAtom } from "@/models/data/atom/editor/HighlightAtoms";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Settings } from "@/models/Settings";

interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps, CalendarInfoProps, ResourceInfoProps {
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
}

const TimelineItems: FC<Props> = (props: Props) => {

	const onSubjectKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline) => {
		handleCellKeyDown(ev, currentTimeline, props.timelineStore, "subject");
	}, [props.timelineStore]);

	const onWorkloadKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline) => {
		handleCellKeyDown(ev, currentTimeline, props.timelineStore, "workload");
	}, [props.timelineStore]);

	const dummyAreaNodes = useMemo(() => {
		console.debug("dummyAreaNodedummyAreaNodedummyAreaNode");
		return Arrays.create(props.configuration.design.dummy.height).map(_ => {
			return (
				<tr key={"dmy-" + IdFactory.createReactKey()} className="dummy timeline-cell timeline-header _dynamic_programmable_cell_height">
					<td className="timeline-cell timeline-id">&nbsp;</td>
					<td className="timeline-cell timeline-subject" />
					<td className="timeline-cell timeline-workload" />
					<td className="timeline-cell timeline-resource" />
					<td className="timeline-cell timeline-relation" />
					<td className="timeline-cell timeline-range-from" />
					<td className="timeline-cell timeline-range-to" />
					<td className="timeline-cell timeline-progress" />
					<td className="timeline-cell timeline-controls" />
				</tr>
			);
		});
	}, [props.configuration]);

	return (
		<div id="timelines">
			<table>
				<tbody>
					{props.timelineStore.sequenceItems.map((a, i) => {
						return (
							<AnyTimelineEditor
								key={a.id}
								configuration={props.configuration}
								setting={props.setting}
								currentTimeline={a}
								timelineStore={props.timelineStore}
								selectingBeginDate={props.selectingBeginDate}
								beginDateCallbacks={props.beginDateCallbacks}
								calendarInfo={props.calendarInfo}
								resourceInfo={props.resourceInfo}
								callbackSubjectKeyDown={onSubjectKeyDown}
								callbackWorkloadKeyDown={onWorkloadKeyDown}
							/>
						);
					})}
				</tbody>
				<tfoot>
					{dummyAreaNodes}
				</tfoot>
			</table>
		</div>
	);
};

export default TimelineItems;

function handleCellKeyDown(ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline, timelineStore: TimelineStore, currentCell: "subject" | "workload"): void {
	if (ev.key !== "Enter") {
		return;
	}

	const currentIndex = Require.get(timelineStore.indexItemMap, currentTimeline.id);
	let nextIndex = -1;

	function getNextTimeline(index: number): AnyTimeline | null {
		const nextTimeline = timelineStore.sequenceItems[index];

		switch (currentCell) {
			case "subject":
				break;

			case "workload":
				if (Settings.maybeGroupTimeline(nextTimeline)) {
					return null;
				}
				break;

			default:
				throw new Error(currentCell);
		}

		return nextTimeline;
	}

	if (ev.shiftKey) {
		for (let i = currentIndex - 1; 0 <= i; i--) {
			const timeline = getNextTimeline(i);
			if (timeline) {
				nextIndex = Require.get(timelineStore.indexItemMap, timeline.id);
				break;
			}
		}
	} else {
		for (let i = currentIndex + 1; i < timelineStore.sequenceItems.length; i++) {
			const timeline = getNextTimeline(i);
			if (timeline) {
				nextIndex = Require.get(timelineStore.indexItemMap, timeline.id);
				break;
			}
		}
	}

	if (nextIndex !== -1) {
		const nextTimeline = timelineStore.sequenceItems[nextIndex];
		const nextCellId = Require.switch(currentCell, {
			"subject": () => Timelines.toSubjectId(nextTimeline),
			"workload": () => Timelines.toWorkloadId(nextTimeline),
		});
		const nextElement = Dom.getElementById(nextCellId, HTMLInputElement);
		nextElement.select();
		nextElement.focus();
	}
}
