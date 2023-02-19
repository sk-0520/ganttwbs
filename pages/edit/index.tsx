import { NextPage } from 'next';
import AppHead from '@/components/layout/AppHead'

const Home: NextPage = () => {
	return (
		<>
			<AppHead title='編集' />
			<main id='edit'>
				ここが心臓部
			</main>
		</>
	);
};

export default Home;
