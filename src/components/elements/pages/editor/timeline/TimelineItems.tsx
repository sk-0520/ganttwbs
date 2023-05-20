
import { FC, useCallback, useMemo, KeyboardEvent, MouseEvent } from "react";

import AnyTimelineEditor from "@/components/elements/pages/editor/timeline/AnyTimelineEditor";
import { Arrays } from "@/models/Arrays";
import { useHoverTimelineIdAtomWriter } from "@/models/data/atom/editor/HighlightAtoms";
import { useSequenceTimelinesAtomReader, useTimelineIndexMapAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { BeginDateCallbacks } from "@/models/data/BeginDate";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline, TimelineId } from "@/models/data/Setting";
import { TimelineCallbacks } from "@/models/data/TimelineCallbacks";
import { Dom } from "@/models/Dom";
import { IdFactory } from "@/models/IdFactory";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	beginDateCallbacks: BeginDateCallbacks;
}

const TimelineItems: FC<Props> = (props: Props) => {
	const sequenceTimelinesAtomReader = useSequenceTimelinesAtomReader();
	const timelineIndexMapAtomReader = useTimelineIndexMapAtomReader();
	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();

	const onSubjectKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline) => {
		handleCellKeyDown(ev, currentTimeline, props.timelineCallbacks, sequenceTimelinesAtomReader.data, timelineIndexMapAtomReader.data, "subject");
	}, [props.timelineCallbacks, sequenceTimelinesAtomReader.data, timelineIndexMapAtomReader.data]);

	const onWorkloadKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline) => {
		handleCellKeyDown(ev, currentTimeline, props.timelineCallbacks, sequenceTimelinesAtomReader.data, timelineIndexMapAtomReader.data, "workload");
	}, [props.timelineCallbacks, sequenceTimelinesAtomReader.data, timelineIndexMapAtomReader.data]);

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

	function handleMouseMove(ev: MouseEvent) {
		hoverTimelineIdAtomWriter.write(undefined);
	}

	return (
		<div id="timelines">
			<table>
				<tbody>
					{sequenceTimelinesAtomReader.data.map((a, i) => {
						return (
							<AnyTimelineEditor
								key={a.id}
								configuration={props.configuration}
								currentTimeline={a}
								timelineCallbacks={props.timelineCallbacks}
								beginDateCallbacks={props.beginDateCallbacks}
								callbackSubjectKeyDown={onSubjectKeyDown}
								callbackWorkloadKeyDown={onWorkloadKeyDown}
							/>
						);
					})}
				</tbody>
				<tfoot
					onMouseEnter={handleMouseMove}
				>
					{dummyAreaNodes}
				</tfoot>
			</table>
		</div>
	);
};

export default TimelineItems;

function handleCellKeyDown(ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline, timelineStore: TimelineCallbacks, sequenceTimelines: ReadonlyArray<AnyTimeline>, timelineIndexMap: ReadonlyMap<TimelineId, number>, currentCell: "subject" | "workload"): void {
	if (ev.key !== "Enter") {
		return;
	}

	const currentIndex = Require.get(timelineIndexMap, currentTimeline.id);
	let nextIndex = -1;

	function getNextTimeline(index: number): AnyTimeline | null {
		const nextTimeline = sequenceTimelines[index];

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
				nextIndex = Require.get(timelineIndexMap, timeline.id);
				break;
			}
		}
	} else {
		for (let i = currentIndex + 1; i < sequenceTimelines.length; i++) {
			const timeline = getNextTimeline(i);
			if (timeline) {
				nextIndex = Require.get(timelineIndexMap, timeline.id);
				break;
			}
		}
	}

	if (nextIndex !== -1) {
		const nextTimeline = sequenceTimelines[nextIndex];
		const nextCellId = Require.switch(currentCell, {
			"subject": () => Timelines.toSubjectId(nextTimeline),
			"workload": () => Timelines.toWorkloadId(nextTimeline),
		});
		const nextElement = Dom.getElementById(nextCellId, HTMLInputElement);
		nextElement.select();
		nextElement.focus();
	}
}
