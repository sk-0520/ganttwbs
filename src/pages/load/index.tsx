import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Layout from "@/components/layout/Layout";
import { Goto } from "@/models/Goto";
import { EditData } from "@/models/data/EditData";
import { Setting, SettingSchema } from "@/models/data/Setting";

interface Input {
	files: FileList;
}

const Page: NextPage = () => {
	const { register, handleSubmit, } = useForm<Input>();
	const router = useRouter();

	return (
		<Layout title='読み込み' mode='page' layoutId='load'>
			<form onSubmit={handleSubmit(data => onSubmit(data, router))}>
				<dl className='inputs'>
					<dt>ファイル</dt>
					<input type='file' {...register("files")} />
				</dl>

				<button className='action'>作業開始</button>
			</form>
		</Layout>
	);
};

export default Page;

async function onSubmit(data: Input, router: NextRouter) {
	console.log(data);
	const file = data.files[0];

	const fileName = file.name;

	const json = await file.text();
	const settingObject = JSON.parse(json);

	//TODO: バージョン確認
	const settingSchemaResult = SettingSchema.safeParse(settingObject);
	if(!settingSchemaResult.success) {
		console.error("error");
		return;
	}
	const setting = settingSchemaResult.data;
	console.debug(setting);
	console.debug(fileName);

	const editData: EditData = {
		fileName: fileName,
		setting: setting,
	};
	Goto.edit(editData, router);
}
