import { NextPage } from "next";
import { useEffect, useState } from "react";

import { useLocale } from "@/models/locales/locale";

import IndexNumber from "./IndexNumber";
import TimelineControls from "./TimelineControls";
import { MoveItemKind } from "./TimelineControls";
import MemberList from "./MemberList";
import { MemberId, TaskTimeline, Timeline, TimelineKind } from "@/models/data/Setting";
import { TimeSpan } from "@/models/TimeSpan";
import { Strings } from "@/models/Strings";
import { TimeRangeKind, TimeRanges } from "@/models/TimeRange";
import Timestamp from "../../Timestamp";
import Timelines from "@/models/Timelines";
import DynamicLabel from "../../DynamicLabel";
import EditProps from "@/models/data/props/EditProps";
import TimeLineEditorProps from "@/models/data/props/TimeLineEditorProps";
import ProgressCell from "./cell/ProgressCell";
import WorkloadCell from "./cell/WorkloadCell";

interface Props extends EditProps, TimeLineEditorProps<TaskTimeline> {
	callbackAddNextSiblingItem: (kind: TimelineKind, currentTimeline: Timeline) => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const selectingId = "timeline-node-previous-" + props.currentTimeline.id;

	const heightStyle = {
		maxHeight: props.configuration.design.cell.maxHeight,
		minHeight: props.configuration.design.cell.minHeight,
	};

	const [subject, setSubject] = useState(props.currentTimeline.subject);
	const [beginKind, setBeginKind] = useState<TimeRangeKind>("loading");
	const [beginDate, setBeginDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [workload, setWorkload] = useState(TimeSpan.parse(props.currentTimeline.workload).totalDays);
	const [memberId, setMemberId] = useState(props.currentTimeline.memberId);
	const [progressPercent, setProgressPercent] = useState(props.currentTimeline.progress * 100.0);
	//const [selectingBeginDate, setSelectingBeginDate] = useState(false);
	const [isSelectedPrevious, setIsSelectedPrevious] = useState(props.selectingBeginDate?.previous.has(props.currentTimeline.id) ?? false);
	const [selectedBeginDate, setSelectedBeginDate] = useState(props.selectingBeginDate?.beginDate ?? null);
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
		if (props.selectingBeginDate) {
			const selected = props.selectingBeginDate.previous.has(props.currentTimeline.id);
			setIsSelectedPrevious(selected);

			setSelectedBeginDate(props.selectingBeginDate.beginDate ?? null);
		}
	}, [props.selectingBeginDate]);

	useEffect(() => {
		if (!props.draggingTimeline) {
			setDropEventClassName('');
		}
	}, [props.draggingTimeline]);

	function handleChangeSubject(s: string) {
		setSubject(s);
		props.currentTimeline.subject = s;
	}

	function handleChangeWorkload(n: number) {
		setWorkload(n);
		props.currentTimeline.workload = TimeSpan.fromDays(n).toString("readable");

		props.callbackRefreshChildrenWorkload();
	}

	function handleChangeProgress(n: number) {
		setProgressPercent(n);
		props.currentTimeline.progress = n / 100.0;

		props.callbackRefreshChildrenProgress();
	}

	function handleControlMoveItem(kind: MoveItemKind) {
		props.callbackRefreshChildrenOrder(kind, props.currentTimeline);
	}

	function handleControlAddItem(kind: TimelineKind) {
		props.callbackAddNextSiblingItem(kind, props.currentTimeline);

		props.callbackRefreshChildrenWorkload();
		props.callbackRefreshChildrenProgress();
	}

	function handleControlDeleteItem() {
		props.callbackDeleteChildTimeline(props.currentTimeline);
	}

	function handleChangeMember(memberId: MemberId): void {
		setMemberId(memberId);
		props.currentTimeline.memberId = memberId;
	}

	function handleClickBeginDate() {
		if (props.selectingBeginDate) {
			return;
		}

		//setSelectingBeginDate(true);
		props.callbackStartSelectBeginDate(props.currentTimeline);
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

	function handleChangeSelectingBeginDate(date: Date | null): void {
		if (!props.selectingBeginDate) {
			return;
		}

		props.selectingBeginDate.beginDate = date;
		setSelectedBeginDate(date);
	}

	function handleClearPrevious() {
		props.callbackClearSelectBeginDate(props.currentTimeline);
	}

	function handleSubmitPrevious() {
		if (!props.selectingBeginDate) {
			return;
		}

		props.currentTimeline.static = props.selectingBeginDate.beginDate ? Strings.formatDate(props.selectingBeginDate.beginDate, "yyyy-MM-dd") : undefined;
		props.currentTimeline.previous = [...props.selectingBeginDate.previous];

		props.callbackSubmitSelectBeginDate(props.currentTimeline);
		props.callbackRefreshChildrenBeginDate();
	}

	function handleCancelPrevious() {
		props.callbackCancelSelectBeginDate(props.currentTimeline)
	}

	function handleDragOver() {
		setDropEventClassName('drag-over')
	}
	function handleDragLeave() {
		setDropEventClassName('')
	}

	return (
		<div className='task' style={heightStyle}>
			<div
				className={
					'timeline-header'
					+ (props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id ? ' dragging' : '')
					+ ' ' + dropEventClassName
				}
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
									disabled={props.selectingBeginDate && props.selectingBeginDate.timeline.id === props.currentTimeline.id}
									value={props.currentTimeline.id}
									checked={isSelectedPrevious}
									onChange={ev => handleChangePrevious(ev.target.checked)}
								/>
							) : (
								<span className="timeline-kind icon-timeline-task-after" />
							)
						}
						<IndexNumber treeIndexes={props.treeIndexes} currentIndex={props.currentIndex} />
					</label>
				</div>
				<div className='timeline-subject'>
					<input
						type='text'
						disabled={props.selectingBeginDate !== null}
						value={subject}
						onChange={ev => handleChangeSubject(ev.target.value)}
					/>
				</div>
				<WorkloadCell
					readOnly={true}
					disabled={props.selectingBeginDate !== null}
					value={workload}
					callbackChangeValue={v => handleChangeWorkload(v)}
				/>
				<div className='timeline-resource'>
					<MemberList
						groups={props.editData.setting.groups}
						selectedMemberId={memberId}
						disabled={props.selectingBeginDate !== null}
						callbackChangeMember={handleChangeMember}
					/>
				</div>
				{
					props.selectingBeginDate && props.selectingBeginDate.timeline.id === props.currentTimeline.id
						? (
							<>
								<div className='timeline-range-area prompt'>
									<div className="single-line no-warp">
										<ul className="inline">
											<li><button type="button" onClick={handleClearPrevious}>🆓</button></li>
											<li>
												<input
													type="date"
													value={selectedBeginDate ? Strings.formatDate(selectedBeginDate, "yyyy-MM-dd") : ''}
													onChange={ev => handleChangeSelectingBeginDate(ev.target.valueAsDate)}
												/>
											</li>
											<li><button type="button" onClick={handleSubmitPrevious}>🆗</button></li>
											<li><button type="button" onClick={handleCancelPrevious}>🆖</button></li>
										</ul>
									</div>
									<div className="tools">
										<ul>
											<li><button>直近項目に紐づける</button></li>
											<li><button>紐づけを解除</button></li>
											<li><button>固定日付をクリア</button></li>
										</ul>
									</div>
								</div>
							</>
						) : (
							beginKind === "success"
								? (
									<>
										<div className={'timeline-range-from ' + (!props.selectingBeginDate ? 'selectable' : '')} onClick={handleClickBeginDate}>
											<DynamicLabel htmlFor={selectingId} wrap={props.selectingBeginDate !== null}>
												<Timestamp format="date" date={beginDate} />
											</DynamicLabel>
										</div>
										<div className={'timeline-range-to ' + (!props.selectingBeginDate ? 'selectable' : '')} onClick={handleClickBeginDate}>
											<DynamicLabel htmlFor={selectingId} wrap={props.selectingBeginDate !== null}>
												<Timestamp format="date" date={endDate} />
											</DynamicLabel>
										</div>
									</>
								) : (
									<div className={"timeline-range-area " + (!props.selectingBeginDate ? 'selectable' : '')} onClick={handleClickBeginDate}>
										<DynamicLabel htmlFor={selectingId} wrap={props.selectingBeginDate !== null}>
											{beginKind}
										</DynamicLabel>
									</div>
								)
						)
				}
				<ProgressCell
					readOnly={false}
					disabled={props.selectingBeginDate !== null}
					value={progressPercent}
					callbackChangeValue={v => handleChangeProgress(v)}
				/>
				<div className="timeline-controls">
					<TimelineControls
						currentTimelineKind="task"
						disabled={props.selectingBeginDate !== null}
						moveItem={handleControlMoveItem}
						addItem={handleControlAddItem}
						deleteItem={handleControlDeleteItem}
					/>
				</div>
			</div>
		</div >
	);
};

export default Component;
