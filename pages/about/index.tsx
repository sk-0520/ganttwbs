import { NextPage } from 'next';
import Layout from '@/components/layout/Layout'

const About: NextPage = () => {
	return (
		<Layout title='これなに？' mode='page' layoutId='about'>
			<p>ガントチャート的な何かをどうこうしたい。</p>
		</Layout>
	);
};

export default About;
