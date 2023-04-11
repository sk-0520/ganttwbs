import { ChartSize } from "@/models/data/ChartSize";
import { TaskTimeline } from "@/models/data/Setting";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStore } from "@/models/store/TimelineStore";
import { NextPage } from "next";

interface Props extends ConfigurationProps {
	chartSize: ChartSize;
	currentTimeline: TaskTimeline;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {
	if (!props.currentTimeline.previous.length) {
		return <></>;
	}

	return (
		<g>
			{props.currentTimeline.previous.map(a => {
				return (
					<line
						key={props.currentTimeline.id + "-" + a}
					/>
				);
			})}
		</g>
	)
};

export default Component;
