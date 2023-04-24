import { NextPage } from "next";
import Link from "next/link";

import Layout from "@/components/layout/Layout";

const AboutPage: NextPage = () => {
	return (
		<Layout title='これなに？' mode='page' layoutId='about'>
			<>
				<p>ガントチャート的な何かをどうこうしたい。</p>
				<ul>
					<li>
						<Link href="/about/library">library</Link>
					</li>
				</ul>
			</>
		</Layout>
	);
};

export default AboutPage;
