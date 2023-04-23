
import { FC } from "react";

import AnyTimelineEditor from "@/components/elements/pages/editor/timeline/AnyTimelineEditor";
import { Arrays } from "@/models/Arrays";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { IdFactory } from "@/models/IdFactory";


interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps, CalendarInfoProps {
	draggingTimeline: DraggingTimeline | null;
	dropTimeline: DropTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
	updateRelations: () => void;
}

const TimelineItems: FC<Props> = (props: Props) => {
	return (
		<div id='timelines'>
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
								draggingTimeline={props.draggingTimeline}
								selectingBeginDate={props.selectingBeginDate}
								beginDateCallbacks={props.beginDateCallbacks}
								calendarInfo={props.calendarInfo}
							/>
						);
					})}
				</tbody>

				<tfoot>
					{
						// ダミー領域追加
						Arrays.create(props.configuration.design.dummy.height).map(_ => {
							return (
								<tr key={"dmy-" + IdFactory.createReactKey()} className="dummy timeline-cell timeline-header _dynamic_programmable_cell_height">
									<td className='timeline-cell timeline-id'>&nbsp;</td>
									<td className='timeline-cell timeline-subject' />
									<td className='timeline-cell timeline-workload' />
									<td className='timeline-cell timeline-resource' />
									<td className="timeline-cell timeline-relation" />
									<td className='timeline-cell timeline-range-from' />
									<td className='timeline-cell timeline-range-to' />
									<td className='timeline-cell timeline-progress' />
									<td className='timeline-cell timeline-controls' />
								</tr>
							);
						})
					}
				</tfoot>
			</table>
		</div>
	);
};

export default TimelineItems;
