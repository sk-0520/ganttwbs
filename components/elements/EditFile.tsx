import { NextPage } from "next";
import { useContext } from "react";
import { useController, useForm, useFormContext } from "react-hook-form";
import { EditContext } from '@/models/data/context/EditContext';

const Component: NextPage = () => {
	const editContext = useContext(EditContext);
	const { register } = useForm<EditContext>();
	//const { register } = useForm();
	// const { control } = useFormContext();
	// const field = useController({
	// 	control: control,
	// 	name: 'fileName',
	// 	defaultValue: editContext.data.fileName
	// });

	function download() {
		const json = JSON.stringify(editContext.data.setting, undefined, 2);

		// download
		const blob = new Blob([json], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = editContext.data.fileName;
		link.click();;
	}

	return (
		<>
			<section>
				<h2>設定</h2>
				<form>
					<dl className="inputs">
						<dt>ファイル名</dt>
						<dd>
							<input type="text" {...register('data.fileName', {
								value: editContext.data.fileName,
								onChange: ev => editContext.data.fileName = ev.target.value
							})} />
						</dd>

						<dt>定期的にファイルをDLする</dt>
						<dd>
							<label>
								<input type='checkbox' {...register('autoSave.isEnabled', {
									value: editContext.autoSave.isEnabled,
									onChange: ev => editContext.autoSave.isEnabled = ev.target.checked
								})} />
								有効にする
							</label>
						</dd>
						<dd>
							<label>
								<input type='number' {...register('autoSave.minutes', {
									value: editContext.autoSave.minutes,
									onChange: ev => editContext.autoSave.minutes = ev.target.value
								})} />
								秒
							</label>
						</dd>
					</dl>
				</form>
			</section>

			<section>
				<h2>出力</h2>
				<ul>
					<li><button onClick={download}>DOWN LOAD</button></li>
				</ul>
			</section>
		</>
	);
};

export default Component;
