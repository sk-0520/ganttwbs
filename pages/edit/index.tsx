import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import FileEditor from '@/components/elements/edit/file/FileEditor'
import SettingEditor from '@/components/elements/edit/setting/SettingEditor'
import Layout from '@/components/layout/Layout'
import { EditData } from '@/models/data/EditData';
import { useRouter } from 'next/router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { EditContext, EditContextImpl } from '@/models/data/context/EditContext';
import * as Storage from "@/models/Storage";
//import * as Setting from '@/models/data/setting/Setting';

const Edit: NextPage = () => {
	const editTabIndex = 1;
	const initTabIndex = 3;
	const router = useRouter();
	const [data, setData] = useState<EditData>();
	const [tabEditMode, setTabEditMode] = useState<string>(editTabIndex === +initTabIndex ? 'visible' : '');

	useEffect(() => {
		const data = Storage.loadEditData();
		if (!data) {
			router.push('/');
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

	function handleSelect(index: number, last: number) {
		if (index === editTabIndex) {
			// 可視化
			setTabEditMode('visible');
		} else if (last === editTabIndex) {
			// 不可視化
			setTabEditMode('');
		}
	}


	return (
		<Layout mode='application' layoutId='edit'
			title={data ? data.fileName + ' 編集' : '編集'}
		>
			<>
				{!data && <p>読み込み中</p>}
				{data && (
					<EditContext.Provider value={new EditContextImpl(data)}>
						<Tabs defaultIndex={initTabIndex} onSelect={handleSelect} >
							<TabList>
								<Tab>ファイル</Tab>
								<Tab>編集</Tab>
								<Tab>設定</Tab>
							</TabList>

							{/* ファイル */}
							<TabPanel className='tab-file'>
								<FileEditor />
							</TabPanel>
							{/* 編集 */}
							<TabPanel className={'tab-edit ' + tabEditMode} >
								<p>
									ほんたい
								</p>
							</TabPanel>
							{/* 設定 */}
							<TabPanel className='tab-setting'>
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

