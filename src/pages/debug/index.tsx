import { NextPage } from "next";
import Link from "next/link";

import Layout from "@/components/layout/Layout";

const DebugPage: NextPage = () => {
	return (
		<Layout title='DEBUG' mode='page' layoutId='debug'>
			<ul>
				<li>
					<Link href="/debug/datetime">DateTime</Link>
				</li>
			</ul>
		</Layout>
	);
};

export default DebugPage;
