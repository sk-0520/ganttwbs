import { NextPage } from "next";
import { CSSProperties, useEffect, useState } from "react";

import Timelines from "@/models/Timelines";
import { useLocale } from "@/models/locales/locale";

import GroupTimelineEditor from "./GroupTimelineEditor";
import TaskTimelineEditor from "./TaskTimelineEditor";
import IndexNumber from "./IndexNumber";
import TimelineControls, { MoveItemKind } from "./TimelineControls";
import { GroupTimeline, TaskTimeline, Theme, Timeline, TimelineKind } from "@/models/data/Setting";
import { TimeRangeKind, TimeRanges } from "@/models/TimeRange";
import Timestamp from "../../Timestamp";
import { Settings } from "@/models/Settings";
import DropTimeline from "@/models/data/DropTimeline";
import DynamicLabel from "../../DynamicLabel";
import EditProps from "@/models/data/props/EditProps";
import TimeLineEditorProps from "@/models/data/props/TimeLineEditorProps";
import ProgressCell from "./cell/ProgressCell";
import WorkloadCell from "./cell/WorkloadCell";
import TimeRangeCell from "./cell/TimeRangeCell";

interface Props extends EditProps, TimeLineEditorProps<GroupTimeline> {
	dropTimeline: DropTimeline | null;
}

const Component: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const selectingId = "timeline-node-previous-" + props.currentTimeline.id;

	const heightStyle: CSSProperties = {
		maxHeight: props.configuration.design.cell.maxHeight,
		minHeight: props.configuration.design.cell.minHeight,
		...getGroupStyles(props.treeIndexes.length, props.editData.setting.theme)
	};

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [workload, setWorkload] = useState(Timelines.sumWorkloadByGroup(props.currentTimeline).totalDays);
	const [beginKind, setBeginKind] = useState<TimeRangeKind>("loading");
	const [beginDate, setBeginDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [progressPercent, setProgressPercent] = useState(Timelines.sumProgressByGroup(props.currentTimeline) * 100.0);
	const [children, setChildren] = useState(props.currentTimeline.children);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);
	const [dropEventClassName, setDropEventClassName] = useState('');

	useEffect(() => {
		const timeRange = props.timeRanges.get(props.currentTimeline.id);
		if (timeRange) {
			setBeginKind(timeRange.kind);
			if (TimeRanges.maybeSuccessTimeRange(timeRange)) {
				setBeginDate(timeRange.begin);
				setEndDate(timeRange.end);
			}
		}
	}, [props.timeRanges]);

	useEffect(() => {
		if (props.dropTimeline) {
			const sourceIsSelf = props.dropTimeline.sourceGroupTimeline?.id === props.currentTimeline.id;
			const destinationIsSelf = props.dropTimeline.destinationGroupTimeline?.id === props.currentTimeline.id;
			console.debug("位置変更!", { sourceIsSelf, destinationIsSelf });

			// 自グループ内で完結する場合は移動するだけ
			if (sourceIsSelf && destinationIsSelf) {
				Timelines.moveTimelineIndex(props.currentTimeline.children, props.dropTimeline.sourceIndex, props.dropTimeline.destinationIndex);
				setChildren([...props.currentTimeline.children]);
			} else {
				// 移動元が自グループのため対象の子を破棄
				if (sourceIsSelf) {
					const nextTimelines = children.filter(a => a.id !== props.dropTimeline!.timeline.id);
					setChildren(props.currentTimeline.children = nextTimelines);
				}

				// 移動先が自グループのため対象の子を追加
				if (destinationIsSelf) {
					props.currentTimeline.children.splice(props.dropTimeline.destinationIndex, 0, props.dropTimeline.timeline);
					setChildren([...props.currentTimeline.children]);
				}
			}
		}
	}, [props.dropTimeline]);

	useEffect(() => {
		if (!props.draggingTimeline) {
			setDropEventClassName('');
			handleUpdateChildrenWorkload();
			handleUpdateChildrenProgress();

			props.callbackRefreshChildrenWorkload();
			props.callbackRefreshChildrenProgress();
		}
	}, [props.draggingTimeline]);

	function handleChangeSubject(s: string) {
		setSubject(s);
		props.currentTimeline.subject = s;
	}

	function handleControlMoveItem(kind: MoveItemKind) {
		props.callbackRefreshChildrenOrder(kind, props.currentTimeline);
	}

	function handleControlAddItem(kind: TimelineKind) {
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

		setChildren([
			...children,
			item,
		]);
		props.currentTimeline.children.push(item);

		handleUpdateChildrenWorkload();
		handleUpdateChildrenProgress();

		props.callbackRefreshChildrenWorkload();
		props.callbackRefreshChildrenProgress();
	}

	function handleControlDeleteItem() {
		props.callbackDeleteChildTimeline(props.currentTimeline);
	}

	function handleUpdateChildrenOrder(kind: MoveItemKind, currentTimeline: Timeline) {
		if (Timelines.moveTimelineOrder(props.currentTimeline.children, kind, currentTimeline)) {
			setChildren([...props.currentTimeline.children]);
		}
	}

	function handleAddNextSiblingItem(kind: TimelineKind, currentTimeline: Timeline): void {
		const currentIndex = children.findIndex(a => a === currentTimeline);

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

		props.currentTimeline.children.splice(currentIndex + 1, 0, item);
		setChildren([...props.currentTimeline.children]);

		props.callbackRefreshChildrenWorkload();
		props.callbackRefreshChildrenProgress();
	}

	function handleUpdateChildrenBeginDate() {
		props.callbackRefreshChildrenBeginDate();
	}

	function handleUpdateChildrenWorkload() {
		const summary = Timelines.sumWorkloadByGroup(props.currentTimeline);
		setWorkload(summary.totalDays);

		props.callbackRefreshChildrenWorkload();
	}

	function handleUpdateChildrenProgress() {
		const progress = Timelines.sumProgressByGroup(props.currentTimeline);
		setProgressPercent(progress * 100.0);

		props.callbackRefreshChildrenProgress();
	}

	function handleDeleteChildren(currentTimeline: Timeline) {
		const nextTimelines = children.filter(a => a.id !== currentTimeline.id);
		setChildren(props.currentTimeline.children = nextTimelines);

		handleUpdateChildrenWorkload();
		handleUpdateChildrenProgress();

		props.callbackRefreshChildrenWorkload();
		props.callbackRefreshChildrenProgress();
	}

	function handleChangePrevious(isSelected: boolean): void {
		if (!props.selectingBeginDate) {
			return;
		}

		if (isSelected) {
			props.selectingBeginDate.previous.add(props.currentTimeline.id);
		} else {
			props.selectingBeginDate.previous.delete(props.currentTimeline.id);
		}
		setIsSelectedPrevious(isSelected);
	}

	function handleDragOver() {
		setDropEventClassName('drag-over')
	}
	function handleDragLeave() {
		setDropEventClassName('')
	}

	return (
		<div className='group'>
			<div
				className={
					'timeline-header'
					+ (props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id ? ' dragging' : '')
					+ ' ' + dropEventClassName
				}
				style={heightStyle}
				onDragEnter={ev => props.draggingTimeline?.onDragEnter(ev, props.currentTimeline)}
				onDragOver={ev => props.draggingTimeline?.onDragOver(ev, props.currentTimeline, handleDragOver)}
				onDragLeave={ev => props.draggingTimeline?.onDragLeave(ev, props.currentTimeline, handleDragLeave)}
				onDrop={ev => props.draggingTimeline?.onDrop(ev, props.currentTimeline)}
			>
				<div
					className={
						'timeline-id'
						+ (props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id ? ' dragging' : '')
					}
					title={props.currentTimeline.id}
					draggable={!props.selectingBeginDate}
					onDragStart={ev => props.callbackDraggingTimeline(ev, props.currentTimeline)}
					onDragEnd={props.draggingTimeline?.onDragEnd}
				>
					<label>
						{props.selectingBeginDate
							? (
								<input
									id={selectingId}
									type="checkbox"
									value={props.currentTimeline.id}
									checked={isSelectedPrevious}
									onChange={ev => handleChangePrevious(ev.target.checked)}
								/>
							) : (
								<span className="timeline-kind icon-timeline-group-after" />
							)
						}
						<IndexNumber treeIndexes={props.treeIndexes} currentIndex={props.currentIndex} />
					</label>
				</div>
				<div className='timeline-subject'>
					<input
						type='text'
						value={subject}
						disabled={props.selectingBeginDate !== null}
						onChange={ev => handleChangeSubject(ev.target.value)}
					/>
				</div>
				<WorkloadCell
					readOnly={true}
					disabled={props.selectingBeginDate !== null}
					value={workload}
				/>
				<div className='timeline-resource'>
				</div>
				<TimeRangeCell
					timeRangeKind={beginKind}
					selectable={props.selectingBeginDate !== null}
					beginDate={beginDate}
					endDate={endDate}
					htmlFor={selectingId}
				/>
				<ProgressCell
					readOnly={true}
					disabled={props.selectingBeginDate !== null}
					value={progressPercent}
				/>
				<div className="timeline-controls">
					<TimelineControls
						currentTimelineKind="group"
						disabled={props.selectingBeginDate !== null}
						moveItem={handleControlMoveItem}
						addItem={handleControlAddItem}
						deleteItem={handleControlDeleteItem}
					/>
				</div>
			</div>
			{props.currentTimeline.children.length ? (
				<ul>
					{props.currentTimeline.children.map((a, i) => {
						return (
							<li key={a.id}>
								{
									Settings.maybeGroupTimeline(a) ? (
										<GroupTimelineEditor
											configuration={props.configuration}
											editData={props.editData}
											treeIndexes={[...props.treeIndexes, props.currentIndex]}
											currentIndex={i}
											parentGroup={props.currentTimeline}
											currentTimeline={a}
											timeRanges={props.timeRanges}
											draggingTimeline={props.draggingTimeline}
											dropTimeline={props.dropTimeline}
											selectingBeginDate={props.selectingBeginDate}
											callbackRefreshChildrenOrder={handleUpdateChildrenOrder}
											callbackRefreshChildrenBeginDate={handleUpdateChildrenBeginDate}
											callbackRefreshChildrenWorkload={handleUpdateChildrenWorkload}
											callbackRefreshChildrenProgress={handleUpdateChildrenProgress}
											callbackDeleteChildTimeline={handleDeleteChildren}
											callbackDraggingTimeline={props.callbackDraggingTimeline}
											callbackStartSelectBeginDate={props.callbackStartSelectBeginDate}
											callbackClearSelectBeginDate={props.callbackClearSelectBeginDate}
											callbackSubmitSelectBeginDate={props.callbackSubmitSelectBeginDate}
											callbackCancelSelectBeginDate={props.callbackCancelSelectBeginDate}
										/>
									) : null
								}
								{
									Settings.maybeTaskTimeline(a) ? (
										<TaskTimelineEditor
											configuration={props.configuration}
											editData={props.editData}
											treeIndexes={[...props.treeIndexes, props.currentIndex]}
											currentIndex={i}
											parentGroup={props.currentTimeline}
											currentTimeline={a}
											timeRanges={props.timeRanges}
											draggingTimeline={props.draggingTimeline}
											selectingBeginDate={props.selectingBeginDate}
											callbackRefreshChildrenOrder={handleUpdateChildrenOrder}
											callbackRefreshChildrenBeginDate={handleUpdateChildrenBeginDate}
											callbackRefreshChildrenWorkload={handleUpdateChildrenWorkload}
											callbackRefreshChildrenProgress={handleUpdateChildrenProgress}
											callbackAddNextSiblingItem={handleAddNextSiblingItem}
											callbackDeleteChildTimeline={handleDeleteChildren}
											callbackDraggingTimeline={props.callbackDraggingTimeline}
											callbackStartSelectBeginDate={props.callbackStartSelectBeginDate}
											callbackClearSelectBeginDate={props.callbackClearSelectBeginDate}
											callbackSubmitSelectBeginDate={props.callbackSubmitSelectBeginDate}
											callbackCancelSelectBeginDate={props.callbackCancelSelectBeginDate}
										/>
									) : null
								}
							</li>
						);
					})}
				</ul>
			) : null}
		</div >
	);
};

export default Component;

function getGroupStyles(level: number, theme: Readonly<Theme>): CSSProperties {
	if (theme.groups.length < level) {
		return {};
	}

	const color = theme.groups[level];

	return {
		backgroundColor: color,
	};
}
