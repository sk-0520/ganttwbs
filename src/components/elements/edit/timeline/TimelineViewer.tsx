import { Design } from "@/models/data/Design";
import { EditProps } from "@/models/data/props/EditProps";
import { TimelineId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeRange } from "@/models/TimeRange";
import { NextPage } from "next";
import GanttChartTimeline from "./GanttChartTimeline";

interface Props extends EditProps {
	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const range = {
		from: new Date(props.editData.setting.calendar.range.from),
		to: new Date(props.editData.setting.calendar.range.to),
	}


	return (
		<div id='viewer'>
			<svg>
				<></>
				{props.editData.setting.timelineNodes.flatMap(a => Settings.maybeGroupTimeline(a) ? a.children : a)
					.map((a, i) => {
						return (
							<GanttChartTimeline
								key={a.id}
								configuration={props.configuration}
								editData={props.editData}
								parentGroup={null}
								currentTimeline={a}
								currentIndex={i}
								range={range}
								timeRanges={props.timeRanges}
								updateRelations={props.updateRelations}
							/>
						);
					})
				}
			</svg>
		</div>
	);
};

export default Component;
