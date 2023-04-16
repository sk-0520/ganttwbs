import { NextPage } from "next";

import { Timelines } from "@/models/Timelines";

import { GroupTimeline, TaskTimeline, Timeline, TimelineKind } from "@/models/data/Setting";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { EditProps } from "@/models/data/props/EditProps";
import { RefreshedChildrenCallbacks } from "@/models/data/RefreshedChildrenCallbacks";
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

	function handleUpdateChildrenBeginDate() {
		props.updateRelations();
	}

	/*
	function canSelectCore(targetTimeline: Timeline, currentTimeline: Timeline): boolean {
		const groups = Timelines.getParentGroup(currentTimeline, props.timelineRootNodes);
		if (groups && groups.length) {
			return !groups.some(a => a.id === targetTimeline.id);
		}

		return true;
	}

	function handleStartSelectBeginDate(timeline: TaskTimeline): void {
		console.debug(timeline);
		setSelectingBeginDate({
			timeline: timeline,
			beginDate: timeline.static ? DateTime.parse(timeline.static, props.calendarInfo.timeZone) : null,
			previous: new Set(timeline.previous),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		})
	}

	function handleClearSelectBeginDate(timeline: TaskTimeline, clearDate: boolean, clearPrevious: boolean): void {
		setSelectingBeginDate(c => ({
			timeline: timeline,
			beginDate: clearDate ? null : c?.beginDate ?? null,
			previous: clearPrevious ? new Set() : c?.previous ?? new Set(),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		}));
	}

	function handleSetSelectBeginDate(timeline: TaskTimeline, set: ReadonlySet<TimelineId>): void {
		setSelectingBeginDate(c => ({
			timeline: timeline,
			beginDate: c?.beginDate ?? null,
			previous: new Set(set),
			canSelect: (targetTimeline) => canSelectCore(targetTimeline, timeline),
		}));
	}

	function handleSubmitSelectBeginDate(timeline: TaskTimeline): void {
		setSelectingBeginDate(null);
	}

	function handleCancelSelectBeginDate(): void {
		setSelectingBeginDate(null);
	}

	const notifyParentCallbacks: NotifyParentCallbacks = {
	};
	*/

	const refreshedChildrenCallbacks: RefreshedChildrenCallbacks = {
		updatedBeginDate: handleUpdateChildrenBeginDate,
		//updateResource: handleUpdateChildrenResource,
	}

	/*
	const beginDateCallbacks: BeginDateCallbacks = {
		startSelectBeginDate: handleStartSelectBeginDate,
		clearSelectBeginDate: handleClearSelectBeginDate,
		setSelectBeginDate: handleSetSelectBeginDate,
		submitSelectBeginDate: handleSubmitSelectBeginDate,
		cancelSelectBeginDate: handleCancelSelectBeginDate,
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
									//notifyParentCallbacks={notifyParentCallbacks}
									refreshedChildrenCallbacks={refreshedChildrenCallbacks}
									beginDateCallbacks={props.beginDateCallbacks}
									callbackAddNextSiblingItem={handleAddNextSiblingItem}
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
