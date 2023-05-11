import { NextPage } from "next";
import Link from "next/link";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";

const TopPage: NextPage = () => {
	const locale = useLocale();

	return (
		<Layout mode="page" layoutId="home">
			<ul>
				<li>
					<Link href="/new">
						{locale.pages.new.title}
					</Link>
				</li>
				<li>
					<Link href="/load">
						{locale.pages.load.title}
					</Link>
				</li>
				<li>
					<Link href="/about">
						{locale.pages.about.title}
					</Link>
				</li>
			</ul>
		</Layout>
	);
};

export default TopPage;
