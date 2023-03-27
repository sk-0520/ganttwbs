import { TimelineId } from "@/models/data/Setting";
import { TimeRange } from "@/models/TimeRange";
import { NextPage } from "next";

interface Props {
	timeRanges: Map<TimelineId, TimeRange>;
	updateRelations: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div id='#viewer'>
			asd
			<canvas />
			asd
		</div>
	);
};

export default Component;
