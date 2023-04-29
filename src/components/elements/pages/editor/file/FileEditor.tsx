import { Editor } from "@monaco-editor/react";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { useLocale } from "@/locales/locale";
import { CssHelper } from "@/models/CssHelper";
import { Configuration } from "@/models/data/Configuration";
import { EditorData } from "@/models/data/EditorData";
import { TimeSpan } from "@/models/TimeSpan";
import { Types } from "@/models/Types";
import { time } from "console";

interface Props {
	isVisible: boolean;
	configuration: Configuration;
	editorData: EditorData;
}

const FileEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const { configuration, editorData: editorData } = props;

	const [fileName, setFileName] = useState(props.editorData.fileName);
	const [autoSaveIsEnabled, setAutoSaveIsEnabled] = useState(props.configuration.autoSave.isEnabled);
	const [autoSaveTime, setAutoSaveTime] = useState(props.configuration.autoSave.time);

	const [settingJson, setSettingJson] = useState("");

	const autoSaveIntervalId = useRef<number>();

	useEffect(() => {
		if (props.isVisible) {
			const json = JSON.stringify(editorData.setting, undefined, 2);
			setSettingJson(json);
		}
	}, [editorData.setting, props.isVisible]);

	useEffect(() => {
		if (autoSaveIntervalId.current) {
			window.clearInterval(autoSaveIntervalId.current);
			autoSaveIntervalId.current = 0;
		}

		if (!fileName || autoSaveTime.ticks <= 0) {
			return;
		}

		if (autoSaveIsEnabled) {
			autoSaveIntervalId.current = window.setInterval(() => {
				downloadJson(fileName, editorData.setting);
			}, autoSaveTime.totalMilliseconds);
		}
	}, [autoSaveIntervalId, editorData, fileName, autoSaveIsEnabled, autoSaveTime]);

	function handleChangeFileName(value: string): void {
		setFileName(editorData.fileName = value);
	}

	function handleChangeAutoSaveIsEnable(checked: boolean): void {
		setAutoSaveIsEnabled(configuration.autoSave.isEnabled = checked);
	}

	function handleChangeAutoSaveTime(minutes: number | undefined): void {
		if (Types.isUndefined(minutes)) {
			return;
		}
		const time = fromAutoSaveTimeValue(minutes);
		setAutoSaveTime(configuration.autoSave.time = time);
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
									checked={autoSaveIsEnabled}
									onChange={ev => handleChangeAutoSaveIsEnable(ev.target.checked)}
								/>
								有効にする
							</label>
						</dd>
						<dd>
							<label>
								<input type='number'
									value={toAutoSaveTimeValue(autoSaveTime)}
									onChange={ev => handleChangeAutoSaveTime(ev.target.valueAsNumber)}
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

function toAutoSaveTimeValue(time: TimeSpan) {
	return time.totalSeconds;
}

function fromAutoSaveTimeValue(value: number): TimeSpan {
	return TimeSpan.fromSeconds(value);
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
