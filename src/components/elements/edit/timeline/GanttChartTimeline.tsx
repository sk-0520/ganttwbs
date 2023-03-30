import { EditProps } from "@/models/data/props/EditProps";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { TimeLineEditorProps } from "@/models/data/props/TimeLineEditorProps";
import { GroupTimeline, Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { SuccessTimeRange, TimeRanges } from "@/models/TimeRange";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";

interface Props extends GanttChartTimelineProps { }

const Component: NextPage<Props> = (props: Props) => {

	const [timeRange, setTimeRange] = useState<SuccessTimeRange | null>();

	useEffect(() => {
		const tr = props.timeRanges.get(props.currentTimeline.id);
		if (tr) {
			if (TimeRanges.maybeSuccessTimeRange(tr)) {
				setTimeRange(tr);
			} else {
				setTimeRange(null);
			}
		}
	}, [props.timeRanges]);

	function renderCurrentTimeline(): ReactNode {
		if (!timeRange) {
			return <></>
		}

		const range = props.editData.setting.calendar.range;
		const cell = props.configuration.design.honest.cell;
		
		//const x =

		return (
			<>
				<rect
					x={10}
					y={10}
					width={10}
					height={10}
				/>
				{props.currentTimeline.id}
			</>
		)
	}

	return (
		<>
			{renderCurrentTimeline()}
			{Settings.maybeGroupTimeline(props.currentTimeline) && props.currentTimeline.children.map((a, i) => {
				return (
					<Component
						key={a.id}
						configuration={props.configuration}
						editData={props.editData}
						parentGroup={props.currentTimeline as GroupTimeline}
						currentTimeline={a}
						currentIndex={i}
						timeRanges={props.timeRanges}
						updateRelations={props.updateRelations}
					/>
				);
			})}
		</>
	);
};

export default Component;
