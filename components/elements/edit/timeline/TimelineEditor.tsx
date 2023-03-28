import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";
import { useEffect, useState } from "react";
import { TimelineId } from "@/models/data/Setting";
import { TimeRange } from "@/models/TimeRange";
import { Timelines } from "@/models/Timelines";
import { EditProps } from "@/models/data/props/EditProps";

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
