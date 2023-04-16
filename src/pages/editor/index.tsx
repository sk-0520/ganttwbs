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

const Page: NextPage = () => {
	const initTabIndex = 1;
	//const initTabIndex = 2;

	const router = useRouter();
	const [configuration] = useState(createConfiguration());
	const [editData, setEditData] = useState<EditorData | null>(null);

	useEffect(() => {
		const editData = Storage.loadEditorData();
		if (!editData) {
			router.push("/");
			return;
		}
		setEditData(editData);
	}, [router]);

	return (
		<Layout mode='application' layoutId='editor'
			title={editData ? editData.fileName + " 編集" : "編集"}
		>
			<>
				{!editData && <p>読み込み中</p>}
				{editData && (
					<Tabs defaultIndex={initTabIndex} forceRenderTabPanel={true} >
						<TabList>
							<Tab>ファイル</Tab>
							<Tab>編集</Tab>
							<Tab>設定</Tab>
						</TabList>

						{/* ファイル */}
						<TabPanel className='tab panel tab-file'>
							<FileEditor configuration={configuration} editData={editData} />
						</TabPanel>
						{/* ほんたい */}
						<TabPanel className='tab panel tab-timeline' >
							<TimelineEditor configuration={configuration} editData={editData} />
						</TabPanel>
						{/* 設定 */}
						<TabPanel className='tab panel tab-setting'>
							<SettingEditor editData={editData} />
						</TabPanel>
					</Tabs>
				)}
			</>
		</Layout>
	);
};

export default Page;

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
