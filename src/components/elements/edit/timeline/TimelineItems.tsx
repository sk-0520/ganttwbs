import { NextPage } from "next";

import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { EditProps } from "@/models/data/props/EditProps";
import { TimelineRootProps } from "@/models/data/props/TimelineRootProps";
import { TimelineStore } from "@/models/store/TimelineStore";
import AnyTimelineEditor from "./AnyTimelineEditor";
import { IdFactory } from "@/models/IdFactory";
import { Arrays } from "@/models/Arrays";
import { CalendarInfo } from "@/models/data/CalendarInfo";

interface Props extends EditProps, TimelineRootProps {
	draggingTimeline: DraggingTimeline | null;
	dropTimeline: DropTimeline | null;
	selectingBeginDate: SelectingBeginDate | null;
	beginDateCallbacks: BeginDateCallbacks;
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	//const [selectingBeginDate, setSelectingBeginDate] = useState<SelectingBeginDate | null>(null);

	/*
	function handleAddNextSiblingItem(kind: TimelineKind, currentTimeline: Timeline) {
		const currentIndex = props.timelineRootNodes.findIndex(a => a === currentTimeline);

		let item: GroupTimeline | TaskTimeline | null = null;
		switch (kind) {
			case "group":
				item = Timelines.createNewGroup();
				break;

			case "task":
				item = Timelines.createNewTask();
				break;

			default:
				throw new Error();
		}

		const nodes = [...props.timelineRootNodes];
		nodes.splice(currentIndex + 1, 0, item)
		props.setTimelineRootNodes(nodes);
	}
	*/

	return (
		<div id='timelines'>
			<>
				<ul>
					{props.timelineRootNodes.map((a, i) => {
						return (
							<li key={a.id}>
								<AnyTimelineEditor
									configuration={props.configuration}
									editData={props.editData}
									treeIndexes={[]}
									currentIndex={i}
									parentGroup={null}
									currentTimeline={a}
									timelineStore={props.timelineStore}
									draggingTimeline={props.draggingTimeline}
									selectingBeginDate={props.selectingBeginDate}
									dropTimeline={props.dropTimeline}
									beginDateCallbacks={props.beginDateCallbacks}
									//callbackAddNextSiblingItem={handleAddNextSiblingItem}
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
							)
						})
					}
				</ul>
			</>
		</div>
	);
};

export default Component;
