import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";
import { ReactNode, useEffect, useState } from "react";
import { AnyTimeline, Calendar, GroupTimeline, TaskTimeline, Theme, TimelineId } from "@/models/data/Setting";
import { Timelines } from "@/models/Timelines";
import { EditProps } from "@/models/data/props/EditProps";
import { Design } from "@/models/data/Design";
import { Designs } from "@/models/Designs";
import { Settings } from "@/models/Settings";
import { TinyColor } from "@ctrl/tinycolor";
import { TimelineStore } from "@/models/store/TimelineStore";
import { TimelineItem } from "@/models/data/TimelineItem";
import Colors from "@/models/Colors";
import { TimeZone } from "@/models/TimeZone";
import { CalendarRange } from "@/models/data/CalendarRange";
import { DateTime } from "@/models/DateTime";
import { WorkRange } from "@/models/data/WorkRange";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { Calendars } from "@/models/Calendars";
import { Arrays } from "@/models/Arrays";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {

	const workRangesCache = new Map<TimelineId, WorkRange>();
	const [timelineNodes, setTimelineNodes] = useState(props.editData.setting.timelineNodes);
	const [timelineStore, setTimelineStore] = useState<TimelineStore>(createTimelineStore(new Map(), new Map()));

	const calendarInfo = Calendars.createCalendarInfo(props.editData.setting.timeZone, props.editData.setting.calendar);

	function createTimelineStore(totalItems: Map<TimelineId, AnyTimeline>, changedItems: Map<TimelineId, TimelineItem>): TimelineStore {

		for (const [k, v] of changedItems) {
			if (v.range) {
				workRangesCache.set(k, v.range);
			}
		}

		const result: TimelineStore = {
			nodeItems: timelineNodes,
			totalItems: totalItems,
			changedItems: changedItems,
			workRanges: workRangesCache,
			updateTimeline: updateTimeline,
			moveTimeline: moveTimeline,
			removeTimeline: removeTimeline,
		};

		return result;
	}

	function updateTimeline(timeline: AnyTimeline): void {
		//
		const source = Timelines.findTimeline(timeline.id, timelineNodes);
		if (!source) {
			return;
		}
		if (source.kind !== timeline.kind) {
			throw new Error();
		}

		const timelineMap = Timelines.getTimelinesMap(timelineNodes);

		const prevSource = { ...source };
		Object.assign(source, timeline);
		const timelineItems = new Array<TimelineItem>();
		timelineItems.push({
			timeline: source
		});

		if (Settings.maybeGroupTimeline(timeline)) {
			const prevGroupSource = prevSource as GroupTimeline;
			if (prevGroupSource.children !== timeline.children) {
				// 関係が変わってる場合はがさっと変えた方が手っ取り早い
				updateRelations();
			}
		}

		if (Settings.maybeTaskTimeline(timeline)) {
			const src = prevSource as TaskTimeline;

			// 先祖グループに対してふわーっと処理
			const groups = Timelines.getParentGroup(timeline, timelineNodes);
			if (groups) {
				const reversedGroups = groups.reverse();
				// 工数
				if (timeline.workload !== src.workload) {
					// 何も考えず全更新(工数が変わってる場合、差分検出するより全更新したほうが手っ取り早い→速度は知らん)
					updateRelations();
					return;
				}
				// 進捗
				if (timeline.progress !== src.progress) {
					for (const group of reversedGroups) {
						timelineItems.push({
							timeline: group
						});
					}
				}
			}
		}

		const changedItems = new Map<TimelineId, TimelineItem>(
			timelineItems.map(a => [a.timeline.id, a])
		);

		const store = createTimelineStore(timelineMap, changedItems);
		setTimelineStore(store);
	}

	function moveTimeline(moveUp: boolean, timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroup(timeline, timelineNodes)
		if (!groups) {
			return;
		}

		if (groups.length) {
			const group = Arrays.last(groups);
			const newChildren = [...group.children];
			Timelines.moveTimelineOrder(newChildren, moveUp, timeline);
			group.children = newChildren;
		} else {
			const newChildren = [...timelineNodes];
			Timelines.moveTimelineOrder(newChildren, moveUp, timeline);
			setTimelineNodes(newChildren);
		}

		// 直接置き換えた値はちまちま反映するのではなくリセット
		updateRelations();
	}

	function removeTimeline(timeline: AnyTimeline): void {
		const groups = Timelines.getParentGroup(timeline, timelineNodes)
		if (!groups) {
			return;
		}

		// データから破棄
		if (groups.length) {
			const group = Arrays.last(groups);
			const newChildren = group.children.filter(a => a.id !== timeline.id);
			group.children = newChildren;
		} else {
			const newTimelineNodes = timelineNodes.filter(a => a.id !== timeline.id);
			props.editData.setting.timelineNodes = newTimelineNodes;
			setTimelineNodes(props.editData.setting.timelineNodes)
		}

		// 前工程から破棄
		const timelineMap = Timelines.getTimelinesMap(timelineNodes);
		for (const [_, value] of timelineMap) {
			if (Settings.maybeTaskTimeline(value)) {
				if (value.previous.includes(timeline.id)) {
					value.previous = value.previous.filter(a => a !== timeline.id);
				}
			}
		}

		// 直接置き換えた値はちまちま反映するのではなくリセット
		updateRelations();
	}

	function updateRelations() {
		console.debug("全体へ通知");

		const timelineMap = Timelines.getTimelinesMap(timelineNodes);
		const dateTimeRanges = Timelines.getDateTimeRanges([...timelineMap.values()], props.editData.setting.calendar.holiday, props.editData.setting.recursive, calendarInfo.timeZone);

		const changedItems = new Map(
			[...timelineMap.entries()]
				.filter(([k, _]) => timelineMap.has(k))
				.map(([k, v]) => {
					const item: TimelineItem = {
						timeline: v,
						range: dateTimeRanges.get(k),
					}

					return [k, item];
				})
		);
		const store = createTimelineStore(timelineMap, changedItems);
		setTimelineStore(store);
	}

	useEffect(() => {
		updateRelations();
	}, []);

	function handleSetTimelineNodes(timelineNodes: Array<GroupTimeline | TaskTimeline>) {
		props.editData.setting.timelineNodes = timelineNodes;
		setTimelineNodes(props.editData.setting.timelineNodes);
	}

	return (
		<div id='timeline'>
			{renderDynamicStyle(props.configuration.design, props.editData.setting.theme)}

			<CrossHeader
				configuration={props.configuration}
				editData={props.editData}
				timelineRootNodes={timelineNodes}
				setTimelineRootNodes={handleSetTimelineNodes}
				calendarInfo={calendarInfo}
			/>
			<DaysHeader
				configuration={props.configuration}
				editData={props.editData}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
			<TimelineItems
				configuration={props.configuration}
				editData={props.editData}
				timelineRootNodes={timelineNodes}
				setTimelineRootNodes={handleSetTimelineNodes}
				updateRelations={updateRelations}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
			<TimelineViewer
				configuration={props.configuration}
				editData={props.editData}
				updateRelations={updateRelations}
				timelineStore={timelineStore}
				calendarInfo={calendarInfo}
			/>
		</div>
	);
};

export default Component;

function renderDynamicStyle(design: Design, theme: Theme): ReactNode {

	// 動的なCSSクラス名をここでがっつり作るのです
	const styleObject = {
		design: design.honest,

		programmable: {
			cell: {
				height: {
					height: design.honest.cell.height,
					maxHeight: design.honest.cell.height,
				},
				width: {
					width: design.honest.cell.width,
					maxWidth: design.honest.cell.width,
				}
			},

			groups: {
				...Array.from(Array(design.programmable.group.maximum), (_, index) => index + 1)
					.map(a => {
						const backgroundColor = (a - 1) in theme.groups ? theme.groups[a - 1] : theme.timeline.group;
						const foregroundColor = Colors.getAutoColor(backgroundColor);

						return {
							[`level-${a}`]: {
								color: foregroundColor.toHexString(),
								background: backgroundColor,
							}
						}
					})
					.reduce((r, a) => ({ ...r, ...a })),
			},

			indexNumber: {
				...Array.from(Array(design.programmable.indexNumber.maximum), (_, index) => index + 1)
					.map(a => {
						return {
							[`level-${a}`]: {
								display: "inline-block",
								paddingLeft: (a * design.programmable.indexNumber.paddingLeft.value) + design.programmable.indexNumber.paddingLeft.unit,
							}
						}
					})
					.reduce((r, a) => ({ ...r, ...a })),
			},
		},

		theme: {
			holiday: {
				regulars: Settings.getWeekDays()
					.filter(a => a in theme.holiday.regulars)
					.map(a => {
						const backgroundColor = new TinyColor(theme.holiday.regulars[a]);
						return {
							[a]: {
								color: Colors.getAutoColor(backgroundColor).toHexString(),
								background: backgroundColor.toHexString(),
							}
						}
					})
					.reduce((r, a) => ({ ...r, ...a })),
				events: Object.entries(theme.holiday.events)
					.map(([k, v]) => {
						const backgroundColor = new TinyColor(v);
						return {
							[k]: {
								color: Colors.getAutoColor(backgroundColor).toHexString(),
								background: `${backgroundColor.toHexString()} !important`
							}
						}
					})
					.reduce((r, a) => ({ ...r, ...a })),
			}
		},
	};

	const styleClasses = Designs.convertStyleClasses(styleObject, ["_dynamic"]);
	const style = Designs.convertStylesheet(styleClasses);

	return (
		<style>
			{style}
		</style>
	);
}
