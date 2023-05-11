import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";
import { EditorData } from "@/models/data/EditorData";
import { SettingSchema } from "@/models/data/Setting";
import { Goto } from "@/models/Goto";

interface Input {
	files: FileList;
}

const LoadPage: NextPage = () => {
	const locale = useLocale();
	const router = useRouter();
	const { register, handleSubmit, } = useForm<Input>();

	return (
		<Layout
			mode="page"
			layoutId="load"
			title={locale.pages.load.title}
		>
			<form onSubmit={handleSubmit(data => onSubmit(data, router))}>
				<dl className="inputs">
					<dt>ファイル</dt>
					<dd>
						<input type="file" {...register("files")} />
					</dd>
				</dl>

				<button className="action">作業開始</button>
			</form>
		</Layout>
	);
};

export default LoadPage;

async function onSubmit(data: Input, router: NextRouter) {
	console.log(data);
	const file = data.files[0];

	const fileName = file.name;

	const json = await file.text();
	const settingObject = JSON.parse(json);

	//TODO: バージョン確認
	const settingSchemaResult = SettingSchema.parse(settingObject);
	/*
	if(!settingSchemaResult.success) {
		console.error("error");
		return;
	}
	const setting = settingSchemaResult.data;
	*/
	const setting = settingSchemaResult;
	console.debug(setting);
	console.debug(fileName);

	const editorData: EditorData = {
		fileName: fileName,
		setting: setting,
	};
	Goto.editor(editorData, router);
}
