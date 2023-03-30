import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	const language = process.env.NEXT_PUBLIC_APP_LANGUAGE;

	return (
		<Html lang={language}>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
