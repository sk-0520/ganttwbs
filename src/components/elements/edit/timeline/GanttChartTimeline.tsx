import { EditProps } from "@/models/data/props/EditProps";
import { GanttChartTimelineProps } from "@/models/data/props/GanttChartTimelineProps";
import { TimeLineEditorProps } from "@/models/data/props/TimeLineEditorProps";
import { GroupTimeline, Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { NextPage } from "next";
import { ReactNode } from "react";

interface Props extends GanttChartTimelineProps { }

const Component: NextPage<Props> = (props: Props) => {

	function renderCurrentTimeline(): ReactNode {
		return (
			<>
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
