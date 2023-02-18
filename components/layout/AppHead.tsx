import { NextPage } from 'next';
import Head from 'next/head';

interface AppHeadProps {
	title?: string
}

const AppHead: NextPage<AppHeadProps> = (props: AppHeadProps) => {
	const title = props.title ? `${props.title} - ${process.env.NEXT_PUBLIC_APP_NAME}` : process.env.NEXT_PUBLIC_APP_NAME;

	return (
		<Head>
			<title>{title}</title>

		</Head>
	);
}

export default AppHead;
