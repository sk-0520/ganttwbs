import { NextPage } from "next";

import DaysHeader from "./DaysHeader";
import Hidariue from "./Hidariue";
import TimelineItems from "./TimelineItems";
import TimelineViewer from "./TimelineViewer";

const Component: NextPage = () => {
	return (
		<div id='timeline'>
			<Hidariue />
			<DaysHeader />
			<TimelineItems />
			<TimelineViewer />
		</div>
	);
};

export default Component;
