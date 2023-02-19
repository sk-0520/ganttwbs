import { NextPage } from 'next';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import EditFile from '@/components/elements/EditFile'
import Layout from '@/components/layout/Layout'
import { EditData } from '@/models/data/EditData';
import { useRouter } from 'next/router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { EditContext, EditContextImpl } from '@/models/data/context/EditContext';
//import * as Setting from '@/models/data/setting/Setting';

const Edit: NextPage = () => {
	const editTabIndex = 1;
	const initTabIndex = 0;
	const router = useRouter();
	const [data, setData] = useState<EditData>();
	const [tabEditMode, setTabEditMode] = useState<string>(editTabIndex === +initTabIndex ? 'visible': '');

	useEffect(() => {
		const sessionData = sessionStorage.getItem('data');
		if (!sessionData) {
			router.push('/');
			return;
		}
		const settingObject = JSON.parse(sessionData);
		// 型チェック
		const data = settingObject as EditData;
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
			title={data ? data.fileName + ' 編集': '編集'}
		>
			<>
				{!data && <p>読み込み中</p>}
				{data && (
					<EditContext.Provider value={new EditContextImpl(data)}>
						<Tabs defaultIndex={initTabIndex} onSelect={handleSelect} >
							<TabList>
								<Tab>ファイル</Tab>
								<Tab>編集</Tab>
								<Tab>メンバー設定</Tab>
								<Tab>休日設定</Tab>
								<Tab>色設定</Tab>
							</TabList>

							{/* ファイル */}
							<TabPanel className='tab-file'>
								<EditFile />
							</TabPanel>
							{/* 編集 */}
							<TabPanel className={'tab-edit ' + tabEditMode} >
								<>
									{[...Array(100)].map(a => <p>ほん{a}たい</p>)}
								</>
							</TabPanel>
							{/* メンバー設定 */}
							<TabPanel className='tab-member'>
							</TabPanel>
							{/* 休日設定 */}
							<TabPanel className='tab-holiday'>
							</TabPanel>
							{/* 色設定 */}
							<TabPanel className='tab-theme'>
							</TabPanel>
						</Tabs>
					</EditContext.Provider>
				)}
			</>
		</Layout>
	);
};

export default Edit;

