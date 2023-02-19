import { NextPage, GetServerSideProps } from 'next';
import Layout from '@/components/layout/Layout'
import { EditData } from '@/models/data/EditData';
//import * as Setting from '@/models/data/setting/Setting';

interface Props {
	data: EditData;
}

const Edit: NextPage<Props> = (props: Props) => {
	return (
		<Layout title='編集' mode='application' layoutId='edit'>
			<>
			ここが心臓部
			{ props.data }
			</>
		</Layout>
	);
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (context) => {

	const sessionData = sessionStorage.getItem('data');
	if (!sessionData) {
		return {
			redirect: {
				destination: '/',
			},
			props: {}
		};
	}

	const settingObject = JSON.parse(sessionData);
	// 型チェック
	const data = settingObject as EditData;

	const props: Props = {
		data: data,
	};

	return {
		props: props
	};
};
