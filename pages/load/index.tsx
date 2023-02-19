import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import Layout from '@/components/layout/Layout'
import { EditData } from '@/models/data/EditData';
import * as Setting from '@/models/data/setting/Setting';
import * as Goto from '@/models/Goto';

interface LoadInput {
	files: FileList;
}

const Load: NextPage = () => {
	const { register, handleSubmit, } = useForm<LoadInput>();
	const router = useRouter();

	return (
		<Layout title='読み込み' mode='page' layoutId='load'>
			<form onSubmit={handleSubmit(data => onSubmit(data, router))}>
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

async function onSubmit(data: LoadInput, router: NextRouter) {
	console.log(data);
	const file = data.files[0];

	const fileName = file.name;

	const json = await file.text();
	const settingObject = JSON.parse(json);
	//TODO: 型チェック
	const setting = settingObject as Setting.Setting;
	console.debug(setting);
	console.debug(fileName);

	const editData: EditData = {
		fileName: fileName,
		setting: setting,
	};
	Goto.edit(editData, router);
}
