import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout/Layout'
import { EditData } from '@/models/data/EditData';
import { useRouter } from 'next/router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
//import * as Setting from '@/models/data/setting/Setting';

const Edit: NextPage = () => {
	const editTabIndex = 1;
	const router = useRouter();
	const [data, setData] = useState<EditData>();
	const [tabEditMode, setTabEditMode] = useState<string>('visible');


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
		<Layout title='編集' mode='application' layoutId='edit'>
			<>
				{!data && <p>読み込み中</p>}
				{data && (
					<Tabs defaultIndex={editTabIndex} onSelect={handleSelect} >
						<TabList>
							<Tab>ファイル</Tab>
							<Tab>編集</Tab>
							<Tab>メンバー設定</Tab>
							<Tab>休日設定</Tab>
							<Tab>色設定</Tab>
						</TabList>

						{/* ファイル */}
						<TabPanel className='tab-file'>
							<p>ファイル設定</p>
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
				)}
			</>
		</Layout>
	);
};

export default Edit;

