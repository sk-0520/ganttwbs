import { NextPage } from "next";

import AnyTimelineEditor from "@/components/elements/pages/editor/timeline/AnyTimelineEditor";
import { Arrays } from "@/models/Arrays";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { EditProps } from "@/models/data/props/EditProps";
import { IdFactory } from "@/models/IdFactory";
import { TimelineStore } from "@/models/store/TimelineStore";


interface Props extends EditProps {
	draggingTimeline: DraggingTimeline | null;
	dropTimeline: DropTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div id='timelines'>
			<ul>
				{props.timelineStore.sequenceItems.map((a, i) => {
					return (
						<li key={a.id}>
							<AnyTimelineEditor
								configuration={props.configuration}
								editData={props.editData}
								treeIndexes={[]}
								currentIndex={i}
								parentGroup={props.timelineStore.rootGroupTimeline}
								currentTimeline={a}
								timelineStore={props.timelineStore}
								draggingTimeline={props.draggingTimeline}
								selectingBeginDate={props.selectingBeginDate}
								beginDateCallbacks={props.beginDateCallbacks}
								calendarInfo={props.calendarInfo}
							/>
						</li>
					);
				})}
				{
					// ダミー領域追加
					Arrays.create(props.configuration.design.dummy.height).map(_ => {
						return (
							<li key={"dmy-" + IdFactory.createReactKey()}>
								<div className="dummy">
									<div className='timeline-cell timeline-header _dynamic_programmable_cell_height'>
										<div className='timeline-cell timeline-id'>&nbsp;</div>
										<div className='timeline-cell timeline-subject' />
										<div className='timeline-cell timeline-workload' />
										<div className='timeline-cell timeline-resource' />
										<div className="timeline-cell timeline-relation" />
										<div className='timeline-cell timeline-range-from' />
										<div className='timeline-cell timeline-range-to' />
										<div className='timeline-cell timeline-progress' />
										<div className='timeline-cell timeline-controls' />
									</div>
								</div>
							</li>
						);
					})
				}
			</ul>
		</div>
	);
};

export default Component;
