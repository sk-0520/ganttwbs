import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";
import { ReactNode, useEffect, useState } from "react";
import { GroupTimeline, TaskTimeline, Theme, TimelineId } from "@/models/data/Setting";
import { TimeRange } from "@/models/TimeRange";
import { Timelines } from "@/models/Timelines";
import { EditProps } from "@/models/data/props/EditProps";
import { Design } from "@/models/data/Design";
import { Designs } from "@/models/Designs";
import { Settings } from "@/models/Settings";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {

	const [timelineNodes, setTimelineNodes] = useState(props.editData.setting.timelineNodes);
	const [timeRanges, setTimeRanges] = useState<Map<TimelineId, TimeRange>>(new Map());

	function updateRelations() {
		console.debug("全体へ通知");

		const timelineMap = Timelines.getTimelinesMap(props.editData.setting.timelineNodes);
		const map = Timelines.getTimeRanges([...timelineMap.values()], props.editData.setting.calendar.holiday, props.editData.setting.recursive);
		setTimeRanges(map);
	}

	useEffect(() => {
		updateRelations();
	}, []);

	function handleSetTimelineNodes(timelineNodes: Array<GroupTimeline | TaskTimeline>) {
		setTimelineNodes(props.editData.setting.timelineNodes = timelineNodes);
	}

	return (
		<div id='timeline'>
			{renderDynamicStyle(props.configuration.design, props.editData.setting.theme)}

			<CrossHeader
				configuration={props.configuration}
				editData={props.editData}
				timelineRootNodes={timelineNodes}
				setTimelineRootNodes={handleSetTimelineNodes}
			/>
			<DaysHeader
				configuration={props.configuration}
				editData={props.editData}
			/>
			<TimelineItems
				configuration={props.configuration}
				editData={props.editData}
				timelineRootNodes={timelineNodes}
				setTimelineRootNodes={handleSetTimelineNodes}
				timeRanges={timeRanges}
				updateRelations={updateRelations}
			/>
			<TimelineViewer
				configuration={props.configuration}
				editData={props.editData}
				timeRanges={timeRanges}
				updateRelations={updateRelations}
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
						return {
							[`level-${a}`]: {
								background: (a - 1) in theme.groups ? theme.groups[a - 1] : theme.timeline.group,
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
					.map(a => ({ [a]: { background: theme.holiday.regulars[a] } }))
					.reduce((r, a) => ({ ...r, ...a })),
				events: Object.entries(theme.holiday.events)
					.map(([k, v]) => ({ [k]: { background: `${v} !important` } }))
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
