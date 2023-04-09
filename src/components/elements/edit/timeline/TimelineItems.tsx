import { NextPage } from "next";
import { DragEvent, useState } from "react";

import { Timelines } from "@/models/Timelines";

import { GroupTimeline, TaskTimeline, Timeline, TimelineId, TimelineKind } from "@/models/data/Setting";
import { BeginDateCallbacks, SelectingBeginDate } from "@/models/data/BeginDate";
import { Settings } from "@/models/Settings";
import { DraggingTimeline } from "@/models/data/DraggingTimeline";
import { DropTimeline } from "@/models/data/DropTimeline";
import { EditProps } from "@/models/data/props/EditProps";
import { RefreshedChildrenCallbacks } from "@/models/data/RefreshedChildrenCallbacks";
import { NotifyParentCallbacks } from "@/models/data/NotifyParentCallbacks";
import { TimelineRootProps } from "@/models/data/props/TimelineRootProps";
import { TimelineStore } from "@/models/store/TimelineStore";
import AnyTimelineEditor from "./AnyTimelineEditor";
import { DateTime } from "@/models/DateTime";
import { TimeZone } from "@/models/TimeZone";
import { CalendarRange } from "@/models/data/CalendarRange";
import { IdFactory } from "@/models/IdFacotory";
import { Arrays } from "@/models/Arrays";

interface Props extends EditProps, TimelineRootProps {
	calendarRange: CalendarRange;
	timeZone: TimeZone;
	updateRelations: () => void;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {
	const [draggingTimeline, setDraggingTimeline] = useState<DraggingTimeline | null>(null);
	const [dropTimeline, setDropTimeline] = useState<DropTimeline | null>(null);
	const [selectingBeginDate, setSelectingBeginDate] = useState<SelectingBeginDate | null>(null);

	function handleUpdateChildrenOrder(moveUp: boolean, currentTimeline: Timeline) {
		const nodes = [...props.timelineRootNodes];
		if (Timelines.moveTimelineOrder(nodes, moveUp, currentTimeline)) {
			props.setTimelineRootNodes(nodes);
		}
	}

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

	function handleDeleteChildren(currentTimeline: Timeline) {
		const nextTimelines = props.timelineRootNodes.filter(a => a !== currentTimeline);

		props.setTimelineRootNodes(nextTimelines);
	}

	function handleUpdateChildrenBeginDate() {
		props.updateRelations();
	}

	function fireDropTimeline(dropTimeline: DropTimeline) {
		console.debug("FIRE");

		if (!dropTimeline.sourceGroupTimeline && !dropTimeline.destinationGroupTimeline) {
			// 最上位完結
			Timelines.moveTimelineIndex(props.timelineRootNodes, dropTimeline.sourceIndex, dropTimeline.destinationIndex);
			props.setTimelineRootNodes(props.timelineRootNodes);
		} else {
			// 最上位に対してあれこれ
			if (!dropTimeline.sourceGroupTimeline) {
				// 移動元が親なので破棄
				const nextTimelines = props.timelineRootNodes.filter(a => a.id !== dropTimeline.timeline.id);
				props.setTimelineRootNodes(nextTimelines);
			}
			if (!dropTimeline.destinationGroupTimeline) {
				// 移動先が親なので追加
				props.timelineRootNodes.splice(dropTimeline.destinationIndex, 0, dropTimeline.timeline);
				props.setTimelineRootNodes(props.timelineRootNodes);
			}
			// 子に通知
			setDropTimeline(dropTimeline);
		}

		setDraggingTimeline(null);
	}

	function handleStartDragTimeline(event: DragEvent, sourceTimeline: GroupTimeline | TaskTimeline): void {
		console.debug(event, sourceTimeline);

		const dragging: DraggingTimeline = {
			sourceTimeline: sourceTimeline,
			onDragEnd: (ev) => {
				console.debug("END", ev, sourceTimeline);
				setDraggingTimeline(null);
			},
			onDragEnter: (ev, targetTimeline) => {
				console.debug("ENTER", ev, targetTimeline);
			},
			onDragOver: (ev, targetTimeline, callback) => {
				console.debug("OVER", ev, targetTimeline);
				// 自分自身への移動は抑制
				if (targetTimeline.id === sourceTimeline.id) {
					return;
				}

				if (Settings.maybeGroupTimeline(sourceTimeline)) {
					// 自分がグループの場合、自分より下への移動は抑制
					const map = Timelines.getTimelinesMap(sourceTimeline.children);
					if (map.has(targetTimeline.id)) {
						return;
					}
				}

				// 自身のグループへの移動は抑制(どうすりゃいいのか正解が分からん)
				if (Settings.maybeGroupTimeline(targetTimeline)) {
					if (targetTimeline.children.find(a => a.id === sourceTimeline.id)) {
						return;
					}
				}

				callback(dragging);
				ev.preventDefault();
			},
			onDragLeave: (ev, targetTimeline, callback) => {
				console.debug("LEAVE", ev, targetTimeline);
				callback(dragging);
			},
			onDrop: (ev, targetTimeline) => {
				console.debug("DROP", ev, targetTimeline);

				const rootNodes = props.timelineRootNodes;
				const sourceGroupTimelines = Timelines.getParentGroup(sourceTimeline, rootNodes);
				const targetGroupTimelines = Timelines.getParentGroup(targetTimeline, rootNodes);

				if (!sourceGroupTimelines || !targetGroupTimelines) {
					// ツリーにいない場合はどうにもならん
					throw new Error(JSON.stringify({
						sourceGroupTimelines,
						targetGroupTimelines,
					}));
				}

				// 最上位から最上位
				if (!sourceGroupTimelines.length && !targetGroupTimelines.length) {
					const sourceIndex = rootNodes.findIndex(a => a.id === sourceTimeline.id);
					const destinationIndex = rootNodes.findIndex(a => a.id === targetTimeline.id);
					if (sourceIndex === -1 || destinationIndex === -1) {
						throw new Error(JSON.stringify({
							sourceIndex,
							destinationIndex,
						}));
					}

					fireDropTimeline({
						timeline: sourceTimeline,
						sourceGroupTimeline: null,
						destinationGroupTimeline: null,
						sourceIndex: sourceIndex,
						destinationIndex: destinationIndex,
					});
					return;
				}

				// 対象がグループの場合、そのグループへ移動
				if (Settings.maybeGroupTimeline(targetTimeline)) {
					const sourceGroupTimeline = sourceGroupTimelines[sourceGroupTimelines.length - 1];
					const sourceIndex = sourceGroupTimeline.children.findIndex(a => a.id === sourceTimeline.id);

					fireDropTimeline({
						timeline: sourceTimeline,
						sourceGroupTimeline: sourceGroupTimeline,
						sourceIndex: sourceIndex,
						destinationGroupTimeline: targetTimeline,
						destinationIndex: -1,
					});
					return;
				}

				// 単純移動
				const sourceNodes = sourceGroupTimelines.length ? sourceGroupTimelines[sourceGroupTimelines.length - 1].children : rootNodes;
				const sourceIndex = sourceNodes.findIndex(a => a.id === sourceTimeline.id);
				const destinationNodes = targetGroupTimelines.length ? targetGroupTimelines[targetGroupTimelines.length - 1].children : rootNodes;
				const destinationIndex = destinationNodes.findIndex(a => a.id === targetTimeline.id);
				fireDropTimeline({
					timeline: sourceTimeline,
					sourceGroupTimeline: sourceGroupTimelines.length ? sourceGroupTimelines[sourceGroupTimelines.length - 1] : null,
					sourceIndex: sourceIndex,
					destinationGroupTimeline: targetGroupTimelines.length ? targetGroupTimelines[targetGroupTimelines.length - 1] : null,
					destinationIndex: destinationIndex,
				});
			}
		};

		setDraggingTimeline(dragging);
	}

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
			beginDate: timeline.static ? DateTime.parse(timeline.static, props.timeZone) : null,
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
		notifyMove: handleUpdateChildrenOrder,
		notifyDelete: handleDeleteChildren,
		notifyDragStart: handleStartDragTimeline,
	};

	const refreshedChildrenCallbacks: RefreshedChildrenCallbacks = {
		updatedBeginDate: handleUpdateChildrenBeginDate,
		//updateResource: handleUpdateChildrenResource,
	}

	const beginDateCallbacks: BeginDateCallbacks = {
		startSelectBeginDate: handleStartSelectBeginDate,
		clearSelectBeginDate: handleClearSelectBeginDate,
		setSelectBeginDate: handleSetSelectBeginDate,
		submitSelectBeginDate: handleSubmitSelectBeginDate,
		cancelSelectBeginDate: handleCancelSelectBeginDate,
	}

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
									draggingTimeline={draggingTimeline}
									selectingBeginDate={selectingBeginDate}
									dropTimeline={dropTimeline}
									notifyParentCallbacks={notifyParentCallbacks}
									refreshedChildrenCallbacks={refreshedChildrenCallbacks}
									beginDateCallbacks={beginDateCallbacks}
									callbackAddNextSiblingItem={handleAddNextSiblingItem}
									timeZone={props.timeZone}
									calendarRange={props.calendarRange}
								/>
							</li>
						);
					})}
					{
						// ダミー領域追加
						Arrays.repeat(0, props.configuration.design.dummy.height).map(_ => {
							return (
								<li key={"dmy-" + IdFactory.createReactKey()}>
									<div className="task dummy">
										<div className='timeline-header _dynamic_programmable_cell_height'>
											<div className='timeline-cell timeline-id'></div>
											<div className='timeline-cell timeline-subject'></div>
											<div className='timeline-cell timeline-workload'></div>
											<div className='timeline-cell timeline-resource'></div>
											<div className="timeline-cell timeline-relation"></div>
											<div className='timeline-cell timeline-range-from'></div>
											<div className='timeline-cell timeline-range-to'></div>
											<div className='timeline-cell timeline-progress'></div>
											<div className='timeline-cell timeline-controls'></div>
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
