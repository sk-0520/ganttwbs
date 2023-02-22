import { NextPage } from 'next';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { EditContext } from '@/models/data/context/EditContext';

const Component: NextPage = () => {
	const editContext = useContext(EditContext);
	const { register } = useForm<EditContext>();

	function download() {
		const json = JSON.stringify(editContext.data.setting, undefined, 2);

		// download
		const blob = new Blob([json], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = editContext.data.fileName;
		link.click();
	}

	return (
		<>
			<dl className='inputs'>
				<dt>設定</dt>
				<dd>
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
				</dd>

				<dt>出力</dt>
				<dd>
					<ul>
						<li><button onClick={download}>DOWN LOAD</button></li>
					</ul>
				</dd>
			</dl>
		</>
	);
};

export default Component;
