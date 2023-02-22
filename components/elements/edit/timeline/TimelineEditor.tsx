import { NextPage } from 'next';
import TimelineHidariue from './TimelineHidariue';
import TimelineTimeHeader from './TimelineTimeHeader';

const Component: NextPage = () => {
	return (
		<div id='timeline'>
			<TimelineHidariue />
			<TimelineTimeHeader />
		</div>
	);
};

export default Component;
