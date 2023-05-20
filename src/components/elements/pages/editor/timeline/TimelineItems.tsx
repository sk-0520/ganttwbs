
import { useAtomValue } from "jotai";
import { FC, useCallback, useMemo, KeyboardEvent } from "react";

import AnyTimelineEditor from "@/components/elements/pages/editor/timeline/AnyTimelineEditor";
import { Arrays } from "@/models/Arrays";
import { TimelineIndexMap, TimelineIndexMapAtom, useSequenceTimelinesAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { AnyTimeline } from "@/models/data/Setting";
import { Dom } from "@/models/Dom";
import { IdFactory } from "@/models/IdFactory";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { Timelines } from "@/models/Timelines";

interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps {
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
}

const TimelineItems: FC<Props> = (props: Props) => {
	const sequenceTimelinesAtomReader = useSequenceTimelinesAtomReader();
	const timelineIndexMap = useAtomValue(TimelineIndexMapAtom);

	const onSubjectKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline) => {
		handleCellKeyDown(ev, currentTimeline, props.timelineStore, sequenceTimelinesAtomReader.data, timelineIndexMap, "subject");
	}, [props.timelineStore, sequenceTimelinesAtomReader.data, timelineIndexMap]);

	const onWorkloadKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline) => {
		handleCellKeyDown(ev, currentTimeline, props.timelineStore, sequenceTimelinesAtomReader.data, timelineIndexMap, "workload");
	}, [props.timelineStore, sequenceTimelinesAtomReader.data, timelineIndexMap]);

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
					{sequenceTimelinesAtomReader.data.map((a, i) => {
						return (
							<AnyTimelineEditor
								key={a.id}
								configuration={props.configuration}
								setting={props.setting}
								currentTimeline={a}
								timelineStore={props.timelineStore}
								selectingBeginDate={props.selectingBeginDate}
								beginDateCallbacks={props.beginDateCallbacks}
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

function handleCellKeyDown(ev: KeyboardEvent<HTMLInputElement>, currentTimeline: AnyTimeline, timelineStore: TimelineStore, sequenceTimelines: ReadonlyArray<AnyTimeline>, timelineIndexMap: TimelineIndexMap, currentCell: "subject" | "workload"): void {
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
