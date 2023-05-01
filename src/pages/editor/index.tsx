import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import FileEditor from "@/components/elements/pages/editor/file/FileEditor";
import SettingEditor from "@/components/elements/pages/editor/setting/SettingEditor";
import TimelineEditor from "@/components/elements/pages/editor/timeline/TimelineEditor";
import Layout from "@/components/layout/Layout";
import { Configuration } from "@/models/data/Configuration";
import { EditorData } from "@/models/data/EditorData";
import { Storages } from "@/models/Storages";
import { TimeSpan } from "@/models/TimeSpan";

const enum TabIndex {
	File,
	Editor,
	Setting
}

const EditorPage: NextPage = () => {
	const router = useRouter();

	const [configuration] = useState(createConfiguration());
	const [editorData, setEditorData] = useState<EditorData | null>(null);
	const [selectedTabIndex, setSelectedTabIndex] = useState(configuration.tabIndex.application);

	function handleOnSelect(index: number, lastIndex: number, event: Event) {
		setSelectedTabIndex(index);
	}

	useEffect(() => {
		const editData = Storages.loadEditorData();
		if (!editData) {
			router.push("/");
			return;
		}
		setEditorData(editData);
	}, [router]);

	return (
		<Layout mode='application' layoutId='editor'
			title={editorData ? editorData.fileName + " 編集" : "編集"}
		>
			<>
				{!editorData && <p>読み込み中</p>}
				{editorData && (
					<Tabs
						defaultIndex={selectedTabIndex}
						forceRenderTabPanel={true}
						onSelect={handleOnSelect}
					>
						<TabList>
							<Tab>ファイル</Tab>
							<Tab>編集</Tab>
							<Tab>設定</Tab>
						</TabList>

						{/* ファイル */}
						<TabPanel className='tab panel tab-file'>
							<FileEditor configuration={configuration} editorData={editorData} isVisible={selectedTabIndex === TabIndex.File} />
						</TabPanel>
						{/* ほんたい */}
						<TabPanel className='tab panel tab-timeline' >
							<TimelineEditor configuration={configuration} editorData={editorData} />
						</TabPanel>
						{/* 設定 */}
						<TabPanel className='tab panel tab-setting'>
							<SettingEditor configuration={configuration} editData={editorData} />
						</TabPanel>
					</Tabs>
				)}
			</>
		</Layout>
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

	const defaultTabIndex = {
		application: 1,
		setting: 0,
	} as const;

	const result: Configuration = {
		tabIndex: {
			application: defaultTabIndex.application,
			setting: defaultTabIndex.setting,
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
				indexNumber: {
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