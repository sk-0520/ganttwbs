import { NextPage } from "next";
import { Fragment } from "react";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";
import license from "@/models/data/generator/license.json";

interface License {
	module: string,
	repository: string,
	license: string,
	licenseNote: string,
	publisher: string
}

const AboutLibraryPage: NextPage = () => {
	const locale = useLocale();

	const getKeys = <T extends object>(json: T): Array<keyof T> => Object.keys(json) as Array<keyof T>;
	const licenseItems = getKeys(license).map(a => {
		const value = license[a];

		const result: License = {
			module: value.module,
			repository: value.repository,
			license: value.licenses,
			licenseNote: value.licenseNote,
			publisher: ("publisher" in value ? value["publisher"] : undefined) ?? "",
		};

		return result;
	});

	return (
		<Layout
			mode="page"
			layoutId="about-library"
			title={locale.pages.about.pages.library.title}
		>
			<table className="license">
				<thead>
					<tr>
						<th>
							{locale.pages.about.pages.library.module}
						</th>
						<th>
							{locale.pages.about.pages.library.author}
						</th>
						<th>
							{locale.pages.about.pages.library.license}
						</th>
					</tr>
				</thead>
				<tbody>
					<>
						{
							licenseItems.map(a => {
								return (
									<Fragment
										key={a.module}
									>
										<tr>
											<td>
												<a href={a.repository} target={a.module}>
													{a.module}
												</a>
											</td>
											<td>{a.publisher}</td>
											<td>{a.license}</td>
										</tr>
										{a.licenseNote && (
											<tr>
												<td colSpan={3}>
													<details>
														<summary>{locale.pages.about.pages.library.licenseNote}</summary>
														<pre className="license-note">{a.licenseNote}</pre>
													</details>
												</td>
											</tr>
										)}
									</Fragment>
								);
							})
						}
					</>
				</tbody>
			</table>
		</Layout>
	);
};

export default AboutLibraryPage;

// function setLibraries() {
// 	//const names = Object.keys(license).sort() as Array<keyof license>;
// 	const names = getKeys(license);
// 	for (const name of names) {
// 		const itemsElement = dom.cloneTemplate(itemTemplateElement);

// 		const value = license[name];

// 		const libraryElement = dom.requireSelector(itemsElement, '[name="library"]', HTMLAnchorElement);
// 		libraryElement.textContent = value.module;
// 		libraryElement.href = value.repository;

// 		const licenseElement = dom.requireSelector(itemsElement, '[name="license"]');
// 		licenseElement.textContent = value.licenses;

// 		const publisherElement = dom.requireSelector(itemsElement, '[name="publisher"]');
// 		publisherElement.textContent = types.getPropertyOr(value, 'publisher', '');

// 		libraryItemsElement.appendChild(itemsElement);
// 	}

// }
