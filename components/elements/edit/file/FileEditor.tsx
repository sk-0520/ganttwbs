import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { EditContext } from "@/models/data/context/EditContext";
import Link from "next/link";

const Component: NextPage = () => {
	const editContext = useContext(EditContext);
	const { register } = useForm<EditContext>();

	const [settingJson, setSettingJson] = useState("");

	useEffect(() => {
		handleJsonUpdate();
	});

	function handleDownload() {
		const json = JSON.stringify(editContext.data.setting);

		// download
		const blob = new Blob([json], { type: "application/json" });
		const link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.download = editContext.data.fileName;
		link.click();
	}

	function handleJsonUpdate() {
		const json = JSON.stringify(editContext.data.setting, undefined, 2);
		setSettingJson(json);
	}

	function handleJsonCopy() {
		navigator.clipboard.writeText(settingJson);
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
								<input type="text"
									defaultValue={editContext.data.fileName}
									{...register("data.fileName", {
										value: editContext.data.fileName,
										onChange: ev => editContext.data.fileName = ev.target.value
									})}
								/>
							</dd>

							<dt>定期的にファイルをDLする</dt>
							<dd>
								<label>
									<input type='checkbox'
										defaultChecked={editContext.autoSave.isEnabled}
										{...register("autoSave.isEnabled", {
											value: editContext.autoSave.isEnabled,
											onChange: ev => editContext.autoSave.isEnabled = ev.target.checked
										})}
									/>
									有効にする
								</label>
							</dd>
							<dd>
								<label>
									<input type='number'
										defaultValue={editContext.autoSave.minutes}
										{...register("autoSave.minutes", {
											value: editContext.autoSave.minutes,
											onChange: ev => editContext.autoSave.minutes = ev.target.value
										})}
									/>
									秒
								</label>
							</dd>
						</dl>
					</form>
				</dd>

				<dt>出力</dt>
				<dd>
					<ul>
						<li><button onClick={handleDownload}>DOWN LOAD</button></li>
					</ul>
				</dd>
				<dd>
					<button onClick={handleJsonUpdate}>update</button>
					<button onClick={handleJsonCopy}>copy</button>
					<textarea
						value={settingJson}
						readOnly={true}
					/>
				</dd>

				<dt>さいなら</dt>
				<dd>
					<ul>
						<li>
							<Link href="/">トップ</Link>
						</li>
						<li>
							<Link href="/new">新規</Link>
						</li>
						<li>
							<Link href="/load">読み込み</Link>
						</li>
					</ul>
				</dd>
			</dl>
		</>
	);
};

export default Component;
