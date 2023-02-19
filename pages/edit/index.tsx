import { NextPage } from 'next';
import Layout from '@/components/layout/Layout'

const Home: NextPage = () => {
	return (
		<Layout title='編集' mode='application' layoutId='edit'>
			ここが心臓部
		</Layout>
	);
};

export default Home;
