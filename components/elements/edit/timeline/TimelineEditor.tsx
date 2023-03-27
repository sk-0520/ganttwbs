import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import CrossHeader from "./CrossHeader";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";

const Component: NextPage = () => {
	return (
		<div id='timeline'>
			<CrossHeader />
			<DaysHeader />
			<TimelineItems />
			<TimelineViewer />
		</div>
	);
};

export default Component;
