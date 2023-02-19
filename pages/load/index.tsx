import { NextPage } from 'next';
import Layout from '@/components/layout/Layout'

const Load: NextPage = () => {
	return (
		<Layout title='読み込み' mode='page' layoutId='load'>
			<input type='file' />
		</Layout>
	);
};

export default Load;
