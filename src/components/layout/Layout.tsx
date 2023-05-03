import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useLocale } from "@/locales/locale";

interface Props {
	/** タイトル */
	title?: string;
	/** アプリケーションか通常ページ */
	mode: "application" | "page";
	/** main 要素に対して付与するID */
	layoutId: string;
	/** 子要素 明示的な指定不要。 */
	children?: React.ReactNode;
}

const Layout: NextPage<Props> = (props: Props) => {
	const locale = useLocale();

	const headTitle = props.title ? `${props.title} - ${process.env.NEXT_PUBLIC_APP_NAME}` : process.env.NEXT_PUBLIC_APP_NAME;
	const pageTitle = props.title ? props.title : process.env.NEXT_PUBLIC_APP_NAME;

	return (
		<>
			<Head>
				<title>{headTitle}</title>
			</Head>
			{
				props.mode === "application"
					? (
						<div id='mode-application'>
							<main id={props.layoutId}>
								{props.children}
							</main>
						</div>
					)
					: (
						<div id='mode-page'>
							<h1>{pageTitle}</h1>
							<header>
								<nav>
									<ul>
										<li>
											<Link href="/">
												{locale.page.top}
											</Link>
										</li>
										<li>
											<Link href="/new">
												{locale.page.new}
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
								</nav>
							</header>
							<main id={props.layoutId}>
								{props.children}
							</main>
							<footer></footer>
						</div>
					)
			}
		</>
	);
};

export default Layout;
