import { NextPage } from "next";
import Link from "next/link";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";

const TopPage: NextPage = () => {
	const locale = useLocale();

	return (
		<Layout mode='page' layoutId='home'>
			<ul>
				<li>
					<Link href="/new">
						{locale.page.top}
					</Link>
				</li>
				<li>
					<Link href="/load">
						{locale.page.load}
					</Link>
				</li>
				<li>
					<Link href="/about">
						{locale.page.about}
					</Link>
				</li>
			</ul>
		</Layout>
	);
};

export default TopPage;
