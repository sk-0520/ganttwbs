import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { Configuration } from "@/models/data/Configuration";
import { EditData } from "@/models/data/EditData";
import { TimeSpan } from "@/models/TimeSpan";

interface Input {
	fileName: string;
	autoSaveIsEnabled: boolean;
	autoSaveMinutes: number;
}

interface Props {
	configuration: Configuration;
	editData: EditData;
}

const Component: NextPage<Props> = (props: Props) => {
	const { configuration, editData } = props;

	const { register } = useForm<Input>();

	const [settingJson, setSettingJson] = useState("");

	useEffect(() => {
		handleJsonUpdate();
	});

	function handleDownload() {
		const json = JSON.stringify(editData.setting);

		// download
		const blob = new Blob([json], { type: "application/json" });
		const link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.download = editData.fileName;
		link.click();
	}

	function handleJsonUpdate() {
		const json = JSON.stringify(editData.setting, undefined, 2);
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
									defaultValue={editData.fileName}
									{...register("fileName", {
										value: editData.fileName,
										onChange: ev => editData.fileName = ev.target.value
									})}
								/>
							</dd>

							<dt>定期的にファイルをDLする</dt>
							<dd>
								<label>
									<input type='checkbox'
										defaultChecked={configuration.autoSave.isEnabled}
										{...register("autoSaveIsEnabled", {
											value: configuration.autoSave.isEnabled,
											onChange: ev => configuration.autoSave.isEnabled = ev.target.checked
										})}
									/>
									有効にする
								</label>
							</dd>
							<dd>
								<label>
									<input type='number'
										defaultValue={configuration.autoSave.span.totalMinutes}
										{...register("autoSaveMinutes", {
											value: configuration.autoSave.span.totalMinutes,
											onChange: ev => configuration.autoSave.span = TimeSpan.fromMinutes(ev.target.valueAsNumber)
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
