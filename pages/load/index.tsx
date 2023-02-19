import { NextPage } from 'next';
import AppHead from '@/components/layout/AppHead'

const Load: NextPage = () => {
	return (
		<>
			<AppHead title='読み込み' />
			<main id='load'>
				<input type='file' />
			</main>
		</>
	);
};

export default Load;
