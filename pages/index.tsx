import { NextPage } from 'next';
import AppHead from '@/components/layout/AppHead'

const Home: NextPage = () => {
	return (
		<>
			<AppHead />
			<main className='home'>
				<ul>
					<li>新規</li>
					<li>読み込み</li>
				</ul>
			</main>
		</>
	);
}

export default Home;
