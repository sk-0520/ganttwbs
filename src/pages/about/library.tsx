import type { NextPage } from "next";
import { Fragment } from "react";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";
import license from "@/models/data/generator/license.json";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";

interface License {
	module: string;
	repository: string;
	license: string;
	licenseNote: string;
	publisher: string;
}

const AboutLibraryPage: NextPage = () => {
	const locale = useLocale();

	const getKeys = <T extends object>(json: T): Array<keyof T> =>
		Object.keys(json) as Array<keyof T>;
	const licenseItems = getKeys(license).map((a) => {
		const value = license[a];

		const result: License = {
			module: value.module,
			repository: value.repository,
			license: value.licenses,
			licenseNote: value.licenseNote,
			publisher: ("publisher" in value ? value.publisher : undefined) ?? "",
		};

		return result;
	});

	return (
		<Layout
			mode="page"
			layoutId="about-library"
			title={locale.pages.about.pages.library.title}
		>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>{locale.pages.about.pages.library.module}</TableCell>
						<TableCell>{locale.pages.about.pages.library.author}</TableCell>
						<TableCell>{locale.pages.about.pages.library.license}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{licenseItems.map((a) => {
						return (
							<Fragment key={a.module}>
								<TableRow>
									<TableCell>
										<a href={a.repository} target={a.module}>
											{a.module}
										</a>
									</TableCell>
									<TableCell>{a.publisher}</TableCell>
									<TableCell>{a.license}</TableCell>
								</TableRow>
								{a.licenseNote && (
									<TableRow>
										<TableCell colSpan={3}>
											<details>
												<summary>
													{locale.pages.about.pages.library.licenseNote}
												</summary>
												<pre className="license-note">{a.licenseNote}</pre>
											</details>
										</TableCell>
									</TableRow>
								)}
							</Fragment>
						);
					})}
				</TableBody>
			</Table>
		</Layout>
	);
};

export default AboutLibraryPage;
