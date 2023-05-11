import { Provider as JotaiProvider } from "jotai";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import AnalyticsViewer from "@/components/elements/pages/editor/analytics/AnalyticsViewer";
import FileEditor from "@/components/elements/pages/editor/file/FileEditor";
import SettingEditor from "@/components/elements/pages/editor/setting/SettingEditor";
import TimelineEditor from "@/components/elements/pages/editor/timeline/TimelineEditor";
import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";
import { Configuration } from "@/models/data/Configuration";
import { EditorData } from "@/models/data/EditorData";
import { Storages } from "@/models/Storages";
import { TimeSpan } from "@/models/TimeSpan";

const enum TabIndex {
	File,
	Editor,
	Analytics,
	Setting,
}

const EditorPage: NextPage = () => {
	const locale = useLocale();
	const router = useRouter();

	const [configuration] = useState(createConfiguration());
	const [editorData, setEditorData] = useState<EditorData | null>(null);
	const [selectedTabIndex, setSelectedTabIndex] = useState(configuration.tabIndex.application);

	function handleOnSelect(index: number, lastIndex: number, event: Event) {
		setSelectedTabIndex(index);
	}

	useEffect(() => {
		const editorData = Storages.loadEditorData();
		if (!editorData) {
			router.push("/");
			return;
		}
		setEditorData(editorData);
	}, [router]);

	return (
		<JotaiProvider>
			<Layout
				mode="application"
				layoutId="editor"
				title={(editorData ? editorData.fileName + " " : "") + locale.pages.editor.title}
			>
				{!editorData && <p>{locale.pages.editor.loading}</p>}
				{editorData && (
					<Tabs
						defaultIndex={selectedTabIndex}
						forceRenderTabPanel={true}
						onSelect={handleOnSelect}
					>
						<TabList>
							<Tab>
								{locale.pages.editor.tabs.file}
							</Tab>
							<Tab>
								{locale.pages.editor.tabs.timeline}
							</Tab>
							<Tab>
								{locale.pages.editor.tabs.analytics}
							</Tab>
							<Tab>
								{locale.pages.editor.tabs.setting}
							</Tab>
						</TabList>

						<TabPanel className="tab panel tab-file">
							<FileEditor configuration={configuration} editorData={editorData} isVisible={selectedTabIndex === TabIndex.File} />
						</TabPanel>
						{/* このアプリの本体 */}
						<TabPanel className="tab panel tab-timeline" >
							<TimelineEditor configuration={configuration} editorData={editorData} />
						</TabPanel>
						<TabPanel className="tab panel tab-analytics" >
							<AnalyticsViewer configuration={configuration} editorData={editorData} isVisible={selectedTabIndex === TabIndex.Analytics} />
						</TabPanel>
						<TabPanel className="tab panel tab-setting">
							<SettingEditor configuration={configuration} editorData={editorData} />
						</TabPanel>
					</Tabs>
				)}
			</Layout>
		</JotaiProvider>
	);
};

export default EditorPage;

function createConfiguration(): Configuration {
	const cell = {
		width: {
			value: 20,
			unit: "px"
		},
		height: {
			value: 20,
			unit: "px"
		}
	};

	const result: Configuration = {
		tabIndex: {
			// application: 1,
			setting: 0,
			application: 2,
		},

		autoSave: {
			storage: {
				isEnabled: true,
				time: TimeSpan.fromSeconds(30),
				step: 0.5,
			},
			download: {
				isEnabled: false,
				time: TimeSpan.fromMinutes(5),
				step: 1,
			}
		},
		design: {
			seed: {
				cell: {
					width: cell.width,
					height: cell.height,
				}
			},
			programmable: {
				group: {
					maximum: 10,
				},
				readableTimelineId: {
					maximum: 10,
					paddingLeft: {
						value: 0.5,
						unit: "ch"
					},
				}
			},
			dummy: {
				width: 30,
				height: 20,
			},
		},
	};

	return result;
}
