import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout'
import { EditData } from '@/models/data/EditData';
import { useRouter } from 'next/router';
//import * as Setting from '@/models/data/setting/Setting';

const Edit: NextPage = () => {
	const router = useRouter();
	//let data: useState EditData ;
	const [data, setData] = useState<EditData>();

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


	return (
		<Layout title='編集' mode='application' layoutId='edit'>
			<>
				{!data && <p>読み込み中</p>}
				{data && <p>{JSON.stringify(data.setting)}</p>}
			</>
		</Layout>
	);
};

export default Edit;

