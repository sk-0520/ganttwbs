import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";
import { ReactNode, useEffect, useState } from "react";
import { TimelineId } from "@/models/data/Setting";
import { TimeRange } from "@/models/TimeRange";
import { Timelines } from "@/models/Timelines";
import { EditProps } from "@/models/data/props/EditProps";
import { Design, ValueUnit } from "@/models/data/Design";
import { Designs } from "@/models/Designs";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {

	const [timeRanges, setTimeRanges] = useState<Map<TimelineId, TimeRange>>(new Map());

	function updateRelations() {
		console.log("全体へ通知");

		const timelineMap = Timelines.getTimelinesMap(props.editData.setting.timelineNodes);
		const map = Timelines.getTimeRanges([...timelineMap.values()], props.editData.setting.calendar.holiday, props.editData.setting.recursive);
		setTimeRanges(map);
	}

	useEffect(() => {
		updateRelations();
	}, []);

	return (
		<div id='timeline'>
			{renderDynamicStyle(props.configuration.design)}

			<CrossHeader
				configuration={props.configuration}
				editData={props.editData}
			/>
			<DaysHeader
				configuration={props.configuration}
				editData={props.editData}
			/>
			<TimelineItems
				configuration={props.configuration}
				editData={props.editData}
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

// function getFlatStyles(parents: ReadonlyArray<string>, obj: object): Array<{ className: string, properties: object }> {
// 	const result = new Array<{ className: string, properties: object }>()

// 	for (const [key, value] of Object.entries(obj)) {
// 		if (typeof (value) === 'object') {
// 			if('value' in value && 'unit' in value) {
// 				const vu = value as ValueUnit;
// 				result.push({
// 					className: key,
// 					properties: {
// 						[key]: Designs.toProperty(vu)
// 					}
// 				});
// 			} else {
// 				const items = getFlatStyles([...parents, key], value);
// 				result.push(...items);
// 			}
// 		} else {

// 		}
// 	}

// 	return result;
// }


function renderDynamicStyle(design: Design): ReactNode {

	const style = `
		._dynamic_cell {
			width: ${Designs.toValue(design.cell.width)};
			height: ${Designs.toValue(design.cell.height)};
		}
	`;

	return (
		<style>
			{style}
		</style>
	);
}
