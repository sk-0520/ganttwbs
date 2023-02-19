import { NextPage } from 'next';
import { useForm } from "react-hook-form";
import Layout from '@/components/layout/Layout'
import * as Setting from '@/models/data/setting/Setting';

interface LoadInput {
	files: FileList;
}

const Load: NextPage = () => {
	const { register, handleSubmit, } = useForm<LoadInput>();

	return (
		<Layout title='読み込み' mode='page' layoutId='load'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<dl className='inputs'>
					<dt>ファイル</dt>
					<input type='file' {...register('files')} />
				</dl>

				<button className='action'>作業開始</button>
			</form>
		</Layout>
	);
};

export default Load;

async function onSubmit(data: LoadInput) {
	console.log(data);
	const file = data.files[0];

	const fileName = file.name;

	const json = await file.text();
	const settingObject = JSON.parse(json);
	//TODO: 型チェック
	const setting = settingObject as Setting.Setting;
	console.debug(setting);
	console.debug(fileName);
}
