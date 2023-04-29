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
import { Storage } from "@/models/Storage";
import { TimeSpan } from "@/models/TimeSpan";

const enum TabIndex {
	File,
	Editor,
	Setting
}

const EditorPage: NextPage = () => {
	const initTabIndex = 1;
	//const initTabIndex = 2;

	const router = useRouter();
	const [configuration] = useState(createConfiguration());
	const [editorData, setEditorData] = useState<EditorData | null>(null);
	const [selectedTabIndex, setSelectedTabIndex] = useState(initTabIndex);

	function handleOnSelect(index: number, lastIndex: number, event: Event) {
		setSelectedTabIndex(index);
	}

	useEffect(() => {
		const editData = Storage.loadEditorData();
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
						defaultIndex={initTabIndex}
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
							<SettingEditor editData={editorData} />
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

	const result: Configuration = {
		autoSave: {
			isEnabled: false,
			span: TimeSpan.fromMinutes(3),
		},
		design: {
			honest: {
				cell: {
					width: cell.width,
					maxWidth: cell.width,
					height: cell.height,
					maxHeight: cell.height,
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
		}
	};

	return result;
}
