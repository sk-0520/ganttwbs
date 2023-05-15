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
				<p>
					{locale.pages.about.description}
				</p>
				<ul className="just-like">
					<li>
						<a href={process.env.NEXT_PUBLIC_APP_REPOSITORY_URL} target="app-repository">
							{locale.pages.about.repository}
						</a>
					</li>
					<li>
						<a href={process.env.NEXT_PUBLIC_APP_LICENSE_URL} target="app-license">
							{locale.pages.about.license}
						</a>
					</li>
					<li>
						<Link href="/about/library">
							{locale.pages.about.pages.library.title}
						</Link>
					</li>
				</ul>
			</>
		</Layout>
	);
};

export default AboutPage;
