import { Editor } from "@monaco-editor/react";
import Link from "next/link";
import path from "path-browserify";
import { FC, useEffect, useRef, useState } from "react";

import { IconKind, IconLabel } from "@/components/elements/Icon";
import AutoSaveRow from "@/components/elements/pages/editor/file/AutoSaveRow";
import { useLocale } from "@/locales/locale";
import { Browsers } from "@/models/Browsers";
import { CssHelper } from "@/models/CssHelper";
import { AutoSaveKind } from "@/models/data/AutoSave";
import { EditorData } from "@/models/data/EditorData";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { DateTime } from "@/models/DateTime";
import { Exports } from "@/models/Exports";
import { Storages } from "@/models/Storages";
import { Strings } from "@/models/Strings";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";
import { Types } from "@/models/Types";

interface Props extends ConfigurationProps {
	isVisible: boolean;
	editorData: EditorData;
}

const FileEditor: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const { configuration, editorData } = props;

	const [fileName, setFileName] = useState(editorData.fileName);

	const [autoSaveStorageIsEnabled, setAutoSaveStorageIsEnabled] = useState(configuration.autoSave.storage.isEnabled);
	const [autoSaveStorageTime, setAutoSaveStorageTime] = useState(configuration.autoSave.storage.time);
	const [autoSaveStorageLastTime, setAutoSaveStorageLastTime] = useState<DateTime>();
	const [autoSaveStorageNextTime, setAutoSaveStorageNextTime] = useState<DateTime>();

	const [autoSaveDownloadIsEnabled, setAutoSaveDownloadIsEnabled] = useState(configuration.autoSave.download.isEnabled);
	const [autoSaveDownloadTime, setAutoSaveDownloadTime] = useState(configuration.autoSave.download.time);
	const [autoSaveDownloadLastTime, setAutoSaveDownloadLastTime] = useState<DateTime>();
	const [autoSaveDownloadNextTime, setAutoSaveDownloadNextTime] = useState<DateTime>();

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

		if (autoSaveStorageTime.ticks <= 0 || !autoSaveStorageIsEnabled) {
			setAutoSaveStorageNextTime(undefined);
			return;
		}

		setAutoSaveStorageNextTime(DateTime.today(TimeZone.getClientTimeZone()).add(autoSaveStorageTime));

		autoSaveStorageIntervalId.current = window.setInterval(() => {
			const now = DateTime.today(TimeZone.getClientTimeZone());
			Storages.saveEditorData(editorData);
			setAutoSaveStorageLastTime(now);
			setAutoSaveStorageNextTime(now.add(autoSaveStorageTime));
		}, autoSaveStorageTime.totalMilliseconds);
	}, [autoSaveStorageIntervalId, editorData, fileName, autoSaveStorageIsEnabled, autoSaveStorageTime]);

	// 自動ダウンロード処理
	useEffect(() => {
		if (autoSaveDownloadIntervalId.current) {
			window.clearInterval(autoSaveDownloadIntervalId.current);
			autoSaveDownloadIntervalId.current = 0;
		}

		if (!fileName || autoSaveDownloadTime.ticks <= 0 || !autoSaveDownloadIsEnabled) {
			setAutoSaveDownloadNextTime(undefined);
			return;
		}

		setAutoSaveDownloadNextTime(DateTime.today(TimeZone.getClientTimeZone()).add(autoSaveDownloadTime));

		autoSaveDownloadIntervalId.current = window.setInterval(() => {
			const now = DateTime.today(TimeZone.getClientTimeZone());
			const autoSaveName = formatAutoDownloadFileName(fileName, locale.pages.editor.file.save.auto.download.fileNameFormat, now);
			downloadJson(autoSaveName, editorData.setting);
			setAutoSaveDownloadLastTime(now);
			setAutoSaveDownloadNextTime(now.add(autoSaveDownloadTime));
		}, autoSaveDownloadTime.totalMilliseconds);
	}, [autoSaveDownloadIntervalId, editorData, fileName, autoSaveDownloadIsEnabled, autoSaveDownloadTime, locale]);


	function handleChangeFileName(value: string): void {
		setFileName(editorData.fileName = value);
	}

	function handleChangeAutoSaveIsEnable(autoSaveKind: AutoSaveKind, checked: boolean): void {
		switch (autoSaveKind) {
			case AutoSaveKind.Storage:
				setAutoSaveStorageIsEnabled(configuration.autoSave.storage.isEnabled = checked);
				break;

			case AutoSaveKind.Download:
				setAutoSaveDownloadIsEnabled(configuration.autoSave.download.isEnabled = checked);
				break;

			default:
				throw new Error();
		}
	}

	function handleChangeAutoSaveTime(autoSaveKind: AutoSaveKind, time: TimeSpan | undefined): void {
		if (Types.isUndefined(time)) {
			return;
		}

		switch (autoSaveKind) {
			case AutoSaveKind.Storage:
				setAutoSaveStorageTime(configuration.autoSave.storage.time = time);
				break;

			case AutoSaveKind.Download:
				setAutoSaveDownloadTime(configuration.autoSave.download.time = time);
				break;

			default:
				throw new Error();
		}
	}

	function handleDownload() {
		downloadJson(fileName, editorData.setting);
	}

	async function handleExportExcel(): Promise<void> {
		const calcData = Exports.calc(editorData.setting);
		const workbook = await Exports.createWorkbook(editorData.setting, calcData, locale);

		const parsedFileName = path.parse(editorData.fileName);
		const fileName = parsedFileName.name + ".xlsx";

		//エクセルファイルを生成する
		const binaries = await workbook.xlsx.writeBuffer();
		const blob = new Blob([binaries], { type: "application/octet-binary" });
		Browsers.download(fileName, blob);
	}

	function handleJsonCopy() {
		Browsers.copyText(settingJson);
	}

	return (
		<dl className="inputs">
			<dt>
				{locale.pages.editor.file.save.title}
			</dt>
			<dd>
				<dl className="inputs">
					<dt>
						{locale.pages.editor.file.save.fileName}
					</dt>
					<dd>
						<input
							type="text"
							value={editorData.fileName}
							onChange={ev => handleChangeFileName(ev.target.value)}
						/>
					</dd>

					<dt>
						{locale.pages.editor.file.save.auto.title}
					</dt>
					<dd>
						<table className="auto-save">
							<thead>
								<tr>
									<th className="kind-cell">
										{locale.pages.editor.file.save.auto.columns.kind}
									</th>
									<th className="enabled-cell">
										{locale.pages.editor.file.save.auto.columns.enabled}
									</th>
									<th className="span-cell">
										{locale.pages.editor.file.save.auto.columns.span}
									</th>
									<th className="last-time-cell">
										{locale.pages.editor.file.save.auto.columns.last}
									</th>
									<th className="next-time-cell">
										{locale.pages.editor.file.save.auto.columns.next}
									</th>
								</tr>
							</thead>
							<tbody>
								{/* eslint-disable-next-line */}
								<AutoSaveRow
									configuration={configuration}
									kind={AutoSaveKind.Storage}
									isEnabled={autoSaveStorageIsEnabled}
									time={autoSaveStorageTime}

									lastTime={autoSaveStorageLastTime}
									nextTime={autoSaveStorageNextTime}

									callbackChangeAutoSaveIsEnable={handleChangeAutoSaveIsEnable}
									callbackChangeAutoSaveTime={handleChangeAutoSaveTime}
								/>
								<AutoSaveRow
									configuration={configuration}
									kind={AutoSaveKind.Download}
									isEnabled={autoSaveDownloadIsEnabled}
									time={autoSaveDownloadTime}

									lastTime={autoSaveDownloadLastTime}
									nextTime={autoSaveDownloadNextTime}

									callbackChangeAutoSaveIsEnable={handleChangeAutoSaveIsEnable}
									callbackChangeAutoSaveTime={handleChangeAutoSaveTime}
								/>
							</tbody>
						</table>
					</dd>
				</dl>
			</dd>

			<dt>
				{locale.pages.editor.file.save.export.title}
			</dt>
			<dd>
				<ul className="inline">
					<li>
						<button onClick={handleExportExcel}>
							<IconLabel
								kind={IconKind.SoftwareExcel}
								label={locale.pages.editor.file.save.export.excel}
							/>
						</button>
					</li>
					<li>
						<button onClick={handleDownload}>
							{locale.common.command.download}
						</button>
					</li>
					<li>
						<button onClick={handleJsonCopy}>
							{locale.common.command.copy}
						</button>
					</li>
				</ul>
			</dd>
			<dd>
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

			<dt>
				{locale.pages.editor.file.byebye}
			</dt>
			<dd>
				<ul>
					<li>
						<Link href="/">
							{locale.pages.top.title}
						</Link>
					</li>
					<li>
						<Link href="/new">
							{locale.pages.new.title}
						</Link>
					</li>
					<li>
						<Link href="/load">
							{locale.pages.load.title}
						</Link>
					</li>
				</ul>
			</dd>
		</dl>
	);
};

export default FileEditor;

function formatAutoDownloadFileName(fileName: string, fileNameFormat: string, timestamp: DateTime): string {
	const parsedFileName = path.parse(fileName);
	const map = new Map([
		["ORIGINAL", fileName],
		["ORIGINAL_NAME", parsedFileName.name],
		["ORIGINAL_EXT", parsedFileName.ext.substring(1)],
		["TIMESTAMP", timestamp.format("yyyy-MM-dd_HHmmss")],
	]);
	return Strings.replaceMap(fileNameFormat, map);
}

function downloadJson(fileName: string, obj: object): void {
	Browsers.downloadJson(fileName, obj, "\t");
}


