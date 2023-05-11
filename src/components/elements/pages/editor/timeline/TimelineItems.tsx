
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


interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps, CalendarInfoProps, ResourceInfoProps {
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
}

const TimelineItems: FC<Props> = (props: Props) => {

	const onSubjectKeyDown = useCallback((ev: KeyboardEvent, currentTimeline: AnyTimeline) => {
		if(ev.key !== "Enter") {
			return;
		}

		const currentIndex = Require.get(props.timelineStore.indexItemMap, currentTimeline.id);
		let nextIndex = -1;
		if (ev.shiftKey) {
			if (0 < currentIndex) {
				nextIndex = currentIndex - 1;
			}
		} else {
			if (currentIndex < props.timelineStore.sequenceItems.length - 1) {
				nextIndex = currentIndex + 1;
			}
		}

		if(nextIndex !== -1) {
			const nextTimeline = props.timelineStore.sequenceItems[nextIndex];
			const nextSubjectId = Timelines.toSubjectId(nextTimeline);
			const nextElement = document.getElementById(nextSubjectId);
			if(nextElement) {
				nextElement.focus();
			}
		}

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
