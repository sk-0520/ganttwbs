import { NextPage } from "next";
import Link from "next/link";

import Layout from "@/components/layout/Layout";

const Page: NextPage = () => {
	return (
		<Layout mode='page' layoutId='home'>
			<ul>
				<li>
					<Link href="/new">新規</Link>
				</li>
				<li>
					<Link href="/load">読み込み</Link>
				</li>
				<li>
					<Link href="/about">これなに？</Link>
				</li>
				{process.env.NODE_ENV !== "production" && (
					<li>
						<Link href="/debug">DEBUG</Link>
					</li>
				)}
			</ul>
		</Layout>
	);
};

export default Page;
