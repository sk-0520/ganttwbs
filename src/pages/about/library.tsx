import { NextPage } from "next";

import Layout from "@/components/layout/Layout";
import license from "@/models/data/license.json";

interface License {
	module: string,
	repository: string,
	license: string,
	publisher: string
}

const AboutLibraryPage: NextPage = () => {
	const getKeys = <T extends object>(json: T): Array<keyof T> => Object.keys(json).sort() as Array<keyof T>;
	const licenseItems = getKeys(license).map(a => {
		const value = license[a];

		const result: License = {
			module: value.module,
			repository: value.repository,
			license: value.licenses,
			publisher: ("publisher" in value ? value["publisher"] : undefined) ?? "",
		};

		return result;
	});

	return (
		<Layout title='ライブラリ' mode='page' layoutId='about-library'>
			<table>
				<tbody>
					<>
						{
							licenseItems.map(a => {
								return (
									<tr key={a.module}>
										<td>{a.module}</td>
										<td>{a.repository}</td>
										<td>{a.license}</td>
										<td>{a.publisher}</td>
									</tr>
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
