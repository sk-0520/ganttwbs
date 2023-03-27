import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";
import { useContext, useEffect, useState } from "react";
import { EditContext } from "@/models/data/context/EditContext";
import { TimelineId } from "@/models/data/Setting";
import { TimeRange } from "@/models/TimeRange";
import Timelines from "@/models/Timelines";

const Component: NextPage = () => {
	const editContext = useContext(EditContext);

	const [timeRanges, setTimeRanges] = useState<Map<TimelineId, TimeRange>>(new Map());

	function updateRelations() {
		console.log("全体へ通知");

		const timelineMap = Timelines.getTimelinesMap(editContext.data.setting.timelineNodes);
		const map = Timelines.getTimeRanges([...timelineMap.values()], editContext.data.setting.calendar.holiday, editContext.data.setting.recursive);
		setTimeRanges(map);
	}

	useEffect(() => {
		updateRelations();
	}, []);

	return (
		<div id='timeline'>
			<CrossHeader />
			<DaysHeader />
			<TimelineItems
				timeRanges={timeRanges}
				updateRelations={updateRelations}
			/>
			<TimelineViewer
				timeRanges={timeRanges}
				updateRelations={updateRelations}
			/>
		</div>
	);
};

export default Component;
