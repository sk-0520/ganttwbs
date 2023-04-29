import { Editor } from "@monaco-editor/react";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";

import { useLocale } from "@/locales/locale";
import { CssHelper } from "@/models/CssHelper";
import { Configuration } from "@/models/data/Configuration";
import { EditorData } from "@/models/data/EditorData";
import { TimeSpan } from "@/models/TimeSpan";
import { Types } from "@/models/Types";
import { Storages } from "@/models/Storages";
import { DateTime } from "@/models/DateTime";

interface Props {
	isVisible: boolean;
	configuration: Configuration;
	editorData: EditorData;
}

const FileEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const { configuration, editorData: editorData } = props;

	const [fileName, setFileName] = useState(props.editorData.fileName);

	const [autoSaveStorageIsEnabled, setAutoSaveStorageIsEnabled] = useState(props.configuration.autoSave.storage.isEnabled);
	const [autoSaveStorageTime, setAutoSaveStorageTime] = useState(props.configuration.autoSave.storage.time);

	const [autoSaveDownloadIsEnabled, setAutoSaveDownloadIsEnabled] = useState(props.configuration.autoSave.download.isEnabled);
	const [autoSaveDownloadTime, setAutoSaveDownloadTime] = useState(props.configuration.autoSave.download.time);

	const [settingJson, setSettingJson] = useState("");

	const autoSaveStorageIntervalId = useRef(0);
	const autoSaveDownloadIntervalId = useRef(0);

	// 画面表示時の表示JSONの更新
	useEffect(() => {
		if (props.isVisible) {
			const json = JSON.stringify(editorData.setting, undefined, 2);
			setSettingJson(json);
		}
	}, [editorData.setting, props.isVisible]);

	// セッションストレージへの保存処理
	useEffect(() => {
		if (autoSaveStorageIntervalId.current) {
			window.clearInterval(autoSaveStorageIntervalId.current);
			autoSaveStorageIntervalId.current = 0;
		}

		if (autoSaveStorageTime.ticks <= 0) {
			return;
		}

		if (autoSaveStorageIsEnabled) {
			autoSaveStorageIntervalId.current = window.setInterval(() => {
				Storages.saveEditorData(editorData);
			}, autoSaveStorageTime.totalMilliseconds);
		}
	}, [autoSaveStorageIntervalId, editorData, fileName, autoSaveStorageIsEnabled, autoSaveStorageTime]);

	// 自動ダウンロード処理
	useEffect(() => {
		if (autoSaveDownloadIntervalId.current) {
			window.clearInterval(autoSaveDownloadIntervalId.current);
			autoSaveDownloadIntervalId.current = 0;
		}

		if (!fileName || autoSaveDownloadTime.ticks <= 0) {
			return;
		}

		if (autoSaveDownloadIsEnabled) {
			autoSaveDownloadIntervalId.current = window.setInterval(() => {
				downloadJson(fileName, editorData.setting);
			}, autoSaveDownloadTime.totalMilliseconds);
		}
	}, [autoSaveDownloadIntervalId, editorData, fileName, autoSaveDownloadIsEnabled, autoSaveDownloadTime]);


	function handleChangeFileName(value: string): void {
		setFileName(editorData.fileName = value);
	}

	function handleChangeAutoDownloadIsEnable(checked: boolean): void {
		setAutoSaveDownloadIsEnabled(configuration.autoSave.download.isEnabled = checked);
	}

	function handleChangeAutoDownloadTime(minutes: number | undefined): void {
		if (Types.isUndefined(minutes)) {
			return;
		}
		const time = fromAutoTimeValue(minutes);
		setAutoSaveDownloadTime(configuration.autoSave.download.time = time);
	}

	function handleDownload() {
		downloadJson(fileName, editorData.setting);
	}

	function handleJsonCopy() {
		navigator.clipboard.writeText(settingJson);
	}

	return (
		<dl className='inputs'>
			<dt>設定</dt>
			<dd>
				<form>
					<dl className="inputs">
						<dt>ファイル名</dt>
						<dd>
							<input type="text"
								value={editorData.fileName}
								onChange={ev => handleChangeFileName(ev.target.value)}
							/>
						</dd>

						<dt>定期的にファイルをDLする</dt>
						<dd>
							<label>
								<input type='checkbox'
									checked={autoSaveDownloadIsEnabled}
									onChange={ev => handleChangeAutoDownloadIsEnable(ev.target.checked)}
								/>
								有効にする
							</label>
						</dd>
						<dd>
							<label>
								<input type='number'
									value={toAutoTimeValue(autoSaveDownloadTime)}
									onChange={ev => handleChangeAutoDownloadTime(ev.target.valueAsNumber)}
								/>
								分
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
				<button onClick={handleJsonCopy}>copy</button>
				<Editor
					value={settingJson}
					defaultLanguage="json"
					height={300}
					options={{
						readOnly: true,
						quickSuggestions: false,
						fontFamily: CssHelper.toFontFamily(locale.styles.editor.fontFamilies),
					}}
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
	);
};

export default FileEditor;

function toAutoTimeValue(time: TimeSpan) {
	return time.totalMinutes;
}

function fromAutoTimeValue(value: number): TimeSpan {
	return TimeSpan.fromMinutes(value);
}

function convertAutoDownloadName(fileName: string, timestamp: DateTime): string {
	throw new Error();
}

function downloadJson(fileName: string, obj: object): void {
	const json = JSON.stringify(obj);

	// download
	const blob = new Blob([json], { type: "application/json" });
	const link = document.createElement("a");
	link.href = window.URL.createObjectURL(blob);
	link.download = fileName;
	link.click();
}
