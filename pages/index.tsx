import { NextPage } from 'next';
import Link from 'next/link';
import AppHead from '@/components/layout/AppHead'

const Home: NextPage = () => {
	return (
		<>
			<AppHead />
			<main id='home'>
				<ul>
					<li>
						<Link href="/new">新規</Link>
					</li>
					<li>
						<Link href="/load">読み込み</Link>
					</li>
				</ul>
			</main>
		</>
	);
};

export default Home;
