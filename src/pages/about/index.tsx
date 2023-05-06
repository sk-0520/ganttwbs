import { NextPage } from "next";
import Link from "next/link";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";

const AboutPage: NextPage = () => {
	const locale = useLocale();

	return (
		<Layout
			mode="page"
			layoutId="about"
			title={locale.pages.about.title}
		>
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
