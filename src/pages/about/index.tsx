import { NextPage } from "next";

import Layout from "@/components/layout/Layout";
import Link from "next/link";

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
