import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import FileEditor from "@/components/elements/edit/file/FileEditor";
import SettingEditor from "@/components/elements/edit/setting/SettingEditor";
import TimelineEditor from "@/components/elements/edit/timeline/TimelineEditor";
import Layout from "@/components/layout/Layout";
import * as Storage from "@/models/Storage";
import { EditData } from "@/models/data/EditData";
import { EditContext, EditContextImpl } from "@/models/data/context/EditContext";
//import * as Setting from '@/models/data/setting/Setting';

const Edit: NextPage = () => {
	const initTabIndex = 1;
	const router = useRouter();
	const [data, setData] = useState<EditData>();

	useEffect(() => {
		const data = Storage.loadEditData();
		if (!data) {
			router.push("/");
			return;
		}
		setData(data);
	}, [router]);

	// const tabRef = useRef<HTMLDivElement>(null);
	// const [tabHeight, setTabHeight] = useState(0);
	// useEffect(() => {
	// 	if(tabRef.current) {
	// 		setTabHeight(tabRef.current.clientHeight)
	// 	}
	// }, [tabRef]);

	return (
		<Layout mode='application' layoutId='edit'
			title={data ? data.fileName + " 編集" : "編集"}
		>
			<>
				{!data && <p>読み込み中</p>}
				{data && (
					<EditContext.Provider value={new EditContextImpl(data)}>
						<Tabs defaultIndex={initTabIndex} forceRenderTabPanel={true} >
							<TabList>
								<Tab>ファイル</Tab>
								<Tab>編集</Tab>
								<Tab>設定</Tab>
							</TabList>

							{/* ファイル */}
							<TabPanel className='tab panel tab-file'>
								<FileEditor />
							</TabPanel>
							{/* ほんたい */}
							<TabPanel className='tab panel tab-timeline' >
								<TimelineEditor />
							</TabPanel>
							{/* 設定 */}
							<TabPanel className='tab panel tab-setting'>
								<SettingEditor />
							</TabPanel>
						</Tabs>
					</EditContext.Provider>
				)}
			</>
		</Layout>
	);
};

export default Edit;

