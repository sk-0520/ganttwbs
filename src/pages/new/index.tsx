import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useId } from "react";
import { useForm } from "react-hook-form";

import Layout from "@/components/layout/Layout";
import { useLocale } from "@/locales/locale";
import { CalendarRange } from "@/models/data/CalendarRange";
import { EditorData } from "@/models/data/EditorData";
import { Member, Setting, WeekDay } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { DefaultSettings } from "@/models/DefaultSettings";
import { Goto } from "@/models/Goto";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";

interface DateRange {
	begin: DateTime;
	end: DateTime;
}

interface Input {
	title: string;
	rangeBeginYear: number,
	rangeBeginMonth: number,
	rangeMonthCount: number,
	mode: "empty" | "sample";
}

const NewPage: NextPage = () => {
	const locale = useLocale();
	const router = useRouter();
	const baseId = useId();
	const { register, handleSubmit, } = useForm<Input>();

	const timeZone = TimeZone.getClientTimeZone();
	const fromDate = DateTime.today(timeZone);
	const defaultMonthCount = 6;

	const id = {
		title: `${baseId}-title`,
		rangeBeginYear: `${baseId}-rangeBeginYear`,
		rangeBeginMonth: `${baseId}-rangeBeginMonth`,
		rangeMonthCount: `${baseId}-rangeMonthCount`,
	} as const;


	return (
		<Layout
			mode="page"
			layoutId="new"
			title={locale.pages.new.title}
		>
			<p>
				{locale.pages.new.description}
			</p>

			<form onSubmit={handleSubmit(data => onSubmit(data, timeZone, router))}>
				<dl className="inputs">
					<dt>
						<label htmlFor={id.title}>
							{locale.pages.new.projectName}
						</label>
					</dt>
					<dd>
						<input
							id={id.title}
							type="text"
							/*DEBUG*/ defaultValue={fromDate.format("L")}
							{...register("title", {
								required: true,
							})}
						/>
					</dd>

					<dt>
						{locale.pages.new.range.title}
					</dt>
					<dd>
						<table className="date-range">
							<tbody>
								<tr>
									<th>
										<label htmlFor={id.rangeBeginYear}>
											{locale.pages.new.range.beginYear}
										</label>
									</th>
									<td>
										<input
											id={id.rangeBeginYear}
											type="number"
											min={1900}
											defaultValue={fromDate.year}
											{...register("rangeBeginYear", {
												valueAsNumber: true,
												required: true,
											})}
										/>
									</td>
								</tr>
								<tr>
									<th>
										<label htmlFor={id.rangeBeginMonth}>
											{locale.pages.new.range.beginMonth}
										</label>
									</th>
									<td>
										<input
											id={id.rangeBeginMonth}
											type="number"
											min={1}
											max={12}
											defaultValue={fromDate.month}
											{...register("rangeBeginMonth", {
												valueAsNumber: true,
												required: true,
											})}
										/>
									</td>
								</tr>
								<tr>
									<th>
										<label htmlFor={id.rangeMonthCount}>
											{locale.pages.new.range.monthCount}
										</label>
									</th>
									<td>
										<input
											id={id.rangeMonthCount}
											type="number"
											min={1}
											defaultValue={defaultMonthCount}
											{...register("rangeMonthCount", {
												valueAsNumber: true,
												required: true,
											})}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</dd>

					<dt>
						{locale.pages.new.mode.title}
					</dt>
					<dd>
						<ul className="inline">
							<li>
								<label>
									<input
										type="radio"
										value="empty"
										{...register("mode", {
											required: true
										})}
									/>
									{locale.pages.new.mode.empty}
								</label>
							</li>
							<li>
								<label>
									<input
										type="radio"
										value="sample"
										{...register("mode", {
											required: true
										})}
									/>
									{locale.pages.new.mode.sample}
								</label>
							</li>
						</ul>
					</dd>
				</dl>

				<button className="action">
					{locale.pages.new.submit}
				</button>
			</form>
		</Layout>
	);
};

export default NewPage;

function onSubmit(data: Input, timeZone: TimeZone, router: NextRouter) {
	console.debug(data);

	const fileName = "new.json";
	let setting: Setting | null = null;

	switch (data.mode) {
		case "sample":
			setting = createSampleSetting(data, timeZone);
			break;

		case "empty":
		default:
			setting = createEmptySetting(data, timeZone);
			break;
	}

	console.debug(setting);
	console.debug(fileName);

	const editData: EditorData = {
		fileName: fileName,
		setting: setting,
	};
	Goto.editor(editData, router);
}

function convertDateRange(data: Input, timeZone: TimeZone): DateRange {
	const begin = DateTime.create(timeZone, data.rangeBeginYear, data.rangeBeginMonth);
	const result: DateRange = {
		begin: begin,
		end: begin.add(data.rangeMonthCount, "month"),
	};

	return result;
}

function createEmptySetting(data: Input, timeZone: TimeZone): Setting {
	const regularHolidays = DefaultSettings.getRegularHolidays();
	const defaultWeekColors = Settings.getWeekDays().filter(a => !(a in regularHolidays)).map(a => ({ [a]: DefaultSettings.BusinessWeekdayColor })).reduce((r, a) => ({ ...r, ...a }));

	const range = convertDateRange(data, timeZone);

	const setting: Setting = {
		name: data.title,
		recursive: DefaultSettings.RecursiveMaxCount,
		version: DefaultSettings.SettingVersion,
		timeZone: timeZone.serialize(),
		calendar: {
			holiday: {
				regulars: Object.keys(regularHolidays) as Array<WeekDay>, //TODO: 何か間違っているかも
				events: {}
			},
			range: {
				begin: Timelines.serializeDateTime(range.begin),
				end: Timelines.serializeDateTime(range.end),
			},
		},
		theme: {
			holiday: {
				regulars: { ...Object.entries(regularHolidays).map(([k, v]) => ({ [k]: v.toHtml() })).reduce((r, a) => ({ ...r, ...a })), ...Object.entries(defaultWeekColors).map(([k, v]) => ({ [k]: v.toHtml() })).reduce((r, a) => ({ ...r, ...a })) },
				events: Object.entries(DefaultSettings.getEventHolidayColors()).map(([k, v]) => ({ [k]: v.toHtml() })).reduce((r, a) => ({ ...r, ...a })),
			},
			groups: DefaultSettings.getGroupThemeColors().map(a => a.toHtml()),
			timeline: DefaultSettings.getTimelineTheme(),
		},
		groups: [],
		rootTimeline: Timelines.createRootTimeline(),
		versions: [],
	};

	return setting;
}

function createSampleSetting(data: Input, timeZone: TimeZone): Setting {
	const setting = createEmptySetting(data, timeZone);

	const range = convertDateRange(data, timeZone);

	const calendarRange: CalendarRange = {
		begin: range.begin,
		end: range.end,
	};
	const お疲れ様 = calendarRange.begin.add(2, "month");

	const price = DefaultSettings.getPriceSetting();

	const members: Record<string, Member> = {
		// 作業者グループ
		wa: {
			id: "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
			name: "作業者A",
			color: "#d9ff00",
			price: price.price,
		},
		wb: {
			id: "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
			name: "作業者B",
			color: "#8cff00",
			price: price.price,
		},
		// 検証グループ
		va: {
			id: "7421f139-fd9a-420b-aa86-781ffbfd8113",
			name: "検証者A",
			color: "#872245",
			price: price.price,
		},
		vb: {
			id: "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
			name: "検証者B",
			color: "#69112f",
			price: price.price,
		},
		// 管理者グループ
		ma: {
			id: "f7294ba4-6775-4f07-a009-5b83231310c8",
			name: "管理者A",
			color: "#007360",
			price: price.price,
		},
		mb: {
			id: "ecbe922c-34e6-4da6-84f6-c108720bef85",
			name: "管理者B",
			color: "#490073",
			price: price.price,
		},
	};

	setting.groups.push({
		name: "1.作業班",
		members: [
			members.wa,
			members.wb,
		],
	});
	setting.groups.push({
		name: "2.検証班",
		members: [
			members.va,
			members.vb,
		],
	});
	setting.groups.push({
		name: "3.管理班",
		members: [
			members.ma,
			members.mb,
		],
	});

	setting.rootTimeline.children = [
		{
			"kind": "task",
			"id": "680e27c0-7320-441e-9ec1-cf485996824e",
			"previous": [],
			"static": Timelines.serializeDateTime(calendarRange.begin.add(TimeSpan.fromDays(10))),
			"progress": 0,
			"workload": Timelines.serializeWorkload(TimeSpan.fromDays(1)),
			"memberId": "",
			"comment": "",
			"subject": "キックオフ"
		},
		//--------------------------
		// 適当に作ってJSONコピペなのだ
		//--------------------------
		{
			"id": "2902b811-44cb-479f-a3ec-ea626396be0d",
			"kind": "task",
			"subject": "後の上位工程",
			"comment": "",
			"previous": [
				"c9072f81-bfdb-402b-9c0d-3a55ab79da5f"
			],
			"workload": "1.00:00:00",
			"memberId": "",
			"progress": 0
		},
		{
			"id": "6c07169a-198c-4194-9e26-fed1e4513655",
			"kind": "group",
			"subject": "設計",
			"children": [
				{
					"id": "1ad3ba8a-60e4-4b9f-b620-1e78b2a981e0",
					"kind": "group",
					"subject": "要件確認",
					"children": [
						{
							"id": "8729fcd6-69ec-44b9-86f0-a51d186d2b12",
							"kind": "task",
							"subject": "現地確認",
							"comment": "",
							"previous": [
								"680e27c0-7320-441e-9ec1-cf485996824e"
							],
							"workload": "1.00:00:00",
							"memberId": "f7294ba4-6775-4f07-a009-5b83231310c8",
							"progress": 0
						},
						{
							"id": "107ef56c-1d3f-4eea-9a36-bdfa09b94bce",
							"kind": "task",
							"subject": "顧客確認",
							"comment": "",
							"previous": [
								"8729fcd6-69ec-44b9-86f0-a51d186d2b12"
							],
							"workload": "1.00:00:00",
							"memberId": "f7294ba4-6775-4f07-a009-5b83231310c8",
							"progress": 0
						},
						{
							"id": "6c2171a9-43de-4d60-b9eb-23b685be18d3",
							"kind": "task",
							"subject": "社内調整",
							"comment": "",
							"previous": [
								"680e27c0-7320-441e-9ec1-cf485996824e"
							],
							"workload": "5.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						}
					],
					"comment": ""
				},
				{
					"id": "8c484c9e-2585-485c-aceb-7a1ec412a9bc",
					"kind": "group",
					"subject": "作業内容確認",
					"children": [
						{
							"id": "189a5420-307a-4fb2-a162-3977647b0753",
							"kind": "task",
							"subject": "必要項目洗い出し",
							"comment": "",
							"previous": [
								"680e27c0-7320-441e-9ec1-cf485996824e"
							],
							"workload": "3.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						},
						{
							"id": "f4a9fb31-82ab-410f-ae42-6d7977de3eec",
							"kind": "task",
							"subject": "文書整理",
							"comment": "",
							"previous": [
								"680e27c0-7320-441e-9ec1-cf485996824e"
							],
							"workload": "4.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "030a414b-dcad-40d5-9508-a554b6ee6fb7",
							"kind": "task",
							"subject": "機器整理",
							"comment": "",
							"previous": [
								"f4a9fb31-82ab-410f-ae42-6d7977de3eec"
							],
							"workload": "2.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						}
					],
					"comment": ""
				},
				{
					"id": "b65076ae-e2be-40ea-93ea-d36bbfa8bfd2",
					"kind": "task",
					"subject": "開始前顧客確認",
					"comment": "",
					"previous": [
						"1ad3ba8a-60e4-4b9f-b620-1e78b2a981e0",
						"8c484c9e-2585-485c-aceb-7a1ec412a9bc"
					],
					"workload": "2.00:00:00",
					"memberId": "f7294ba4-6775-4f07-a009-5b83231310c8",
					"progress": 0
				},
				{
					"id": "c9072f81-bfdb-402b-9c0d-3a55ab79da5f",
					"kind": "group",
					"subject": "設計作業",
					"children": [
						{
							"id": "598b203c-8c04-4122-8d50-06d3ea9e259b",
							"kind": "task",
							"subject": "設計-要件A",
							"comment": "",
							"previous": [
								"b65076ae-e2be-40ea-93ea-d36bbfa8bfd2"
							],
							"workload": "2.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "de7e4757-d56f-48ae-b6a1-ddef6c089ddf",
							"kind": "task",
							"subject": "設計-要件B",
							"comment": "",
							"previous": [
								"b65076ae-e2be-40ea-93ea-d36bbfa8bfd2"
							],
							"workload": "2.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						},
						{
							"id": "cb9b1c74-3727-4b8e-a1ed-4db7c8880d18",
							"kind": "task",
							"subject": "設計-要件C",
							"comment": "",
							"previous": [
								"598b203c-8c04-4122-8d50-06d3ea9e259b"
							],
							"workload": "2.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "449915f4-3107-48fc-aa7b-767e87817661",
							"kind": "task",
							"subject": "設計-要件D",
							"comment": "",
							"previous": [
								"de7e4757-d56f-48ae-b6a1-ddef6c089ddf"
							],
							"workload": "2.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						},
						{
							"id": "45ab760b-5d62-486c-81bf-3b9b2b822a44",
							"kind": "task",
							"subject": "設計-要件E",
							"comment": "",
							"previous": [
								"cb9b1c74-3727-4b8e-a1ed-4db7c8880d18"
							],
							"workload": "4.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "9f9b28f4-ff08-45bf-88ed-4be86f9b06b1",
							"kind": "task",
							"subject": "設計-要件F",
							"comment": "",
							"previous": [
								"449915f4-3107-48fc-aa7b-767e87817661"
							],
							"workload": "1.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						}
					],
					"comment": ""
				}
			],
			"comment": ""
		},
		{
			"id": "e407fa61-333b-41b9-8c73-e4ca27dde33a",
			"kind": "group",
			"subject": "作業",
			"children": [
				{
					"id": "d6d080c8-ef21-43d7-908b-f9d325c2e488",
					"kind": "group",
					"subject": "作成",
					"children": [
						{
							"id": "0627a5c3-0107-4cfc-a69d-756b5b440c72",
							"kind": "task",
							"subject": "作業-要件A",
							"comment": "",
							"previous": [
								"c9072f81-bfdb-402b-9c0d-3a55ab79da5f"
							],
							"workload": "2.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "a130c8f6-264b-49cc-a909-2b84d2cd74be",
							"kind": "task",
							"subject": "作業-要件B",
							"comment": "",
							"previous": [
								"c9072f81-bfdb-402b-9c0d-3a55ab79da5f"
							],
							"workload": "2.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						},
						{
							"id": "9f4b1cef-3da6-4f11-8d99-cdf1b8c5392b",
							"kind": "task",
							"subject": "作業-要件C",
							"comment": "",
							"previous": [
								"0627a5c3-0107-4cfc-a69d-756b5b440c72"
							],
							"workload": "2.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "34a3db1d-645a-4136-9216-0e8631e8240e",
							"kind": "task",
							"subject": "作業-要件D",
							"comment": "",
							"previous": [
								"a130c8f6-264b-49cc-a909-2b84d2cd74be"
							],
							"workload": "2.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						},
						{
							"id": "0b176d7d-7885-4e56-8ec2-a8f932b7c6f2",
							"kind": "task",
							"subject": "作業-要件E",
							"comment": "",
							"previous": [
								"9f4b1cef-3da6-4f11-8d99-cdf1b8c5392b"
							],
							"workload": "5.00:00:00",
							"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
							"progress": 0
						},
						{
							"id": "d720520b-04c1-4b0e-b062-0f7051f7e0d6",
							"kind": "task",
							"subject": "作業-要件F",
							"comment": "",
							"previous": [
								"34a3db1d-645a-4136-9216-0e8631e8240e"
							],
							"workload": "1.00:00:00",
							"memberId": "755460d6-2b3b-42ef-99e5-4a8e8efbe779",
							"progress": 0
						}
					],
					"comment": ""
				},
				{
					"id": "732ae358-9644-47ae-8afd-8d9d7402fca5",
					"kind": "group",
					"subject": "検証準備",
					"children": [
						{
							"id": "58e87f04-6467-4c10-b075-00208baa0bf5",
							"kind": "task",
							"subject": "準備-要件A",
							"comment": "",
							"previous": [
								"598b203c-8c04-4122-8d50-06d3ea9e259b"
							],
							"workload": "3.00:00:00",
							"memberId": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"progress": 0
						},
						{
							"id": "4b907f1a-25ee-4416-aa36-cebf39dfe7a8",
							"kind": "task",
							"subject": "準備-要件B",
							"comment": "",
							"previous": [
								"de7e4757-d56f-48ae-b6a1-ddef6c089ddf"
							],
							"workload": "3.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						},
						{
							"id": "59436b31-2de1-405b-a68c-fa2e64e28523",
							"kind": "task",
							"subject": "準備-要件C",
							"comment": "",
							"previous": [
								"cb9b1c74-3727-4b8e-a1ed-4db7c8880d18",
								"58e87f04-6467-4c10-b075-00208baa0bf5"
							],
							"workload": "3.00:00:00",
							"memberId": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"progress": 0
						},
						{
							"id": "28426e33-25b7-41f4-941d-c5bd5d8815a7",
							"kind": "task",
							"subject": "準備-要件D",
							"comment": "",
							"previous": [
								"449915f4-3107-48fc-aa7b-767e87817661",
								"4b907f1a-25ee-4416-aa36-cebf39dfe7a8"
							],
							"workload": "3.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						},
						{
							"id": "c5f5e72e-bd23-433a-b55c-a6ad21b319a6",
							"kind": "task",
							"subject": "準備-要件E",
							"comment": "",
							"previous": [
								"45ab760b-5d62-486c-81bf-3b9b2b822a44",
								"59436b31-2de1-405b-a68c-fa2e64e28523"
							],
							"workload": "5.00:00:00",
							"memberId": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"progress": 0
						},
						{
							"id": "0ed76a04-f080-47ee-a490-aa8471d029fd",
							"kind": "task",
							"subject": "準備-要件F",
							"comment": "",
							"previous": [
								"9f9b28f4-ff08-45bf-88ed-4be86f9b06b1",
								"28426e33-25b7-41f4-941d-c5bd5d8815a7"
							],
							"workload": "2.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						}
					],
					"comment": ""
				}
			],
			"comment": ""
		},
		{
			"id": "ded9cd24-5747-43f4-a129-c0a540a18843",
			"kind": "group",
			"subject": "検証",
			"children": [
				{
					"id": "25d7c26c-6e62-4dfb-a8c5-77c9991aaa6b",
					"kind": "group",
					"subject": "検証作業",
					"children": [
						{
							"id": "351216b9-1a20-42ba-a325-2fa8b7b04f64",
							"kind": "task",
							"subject": "検証-要件A",
							"comment": "",
							"previous": [
								"732ae358-9644-47ae-8afd-8d9d7402fca5",
								"d6d080c8-ef21-43d7-908b-f9d325c2e488"
							],
							"workload": "2.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						},
						{
							"id": "1cad2b3e-88e2-4b95-8299-cb658951e5a9",
							"kind": "task",
							"subject": "検証-要件B",
							"comment": "",
							"previous": [
								"732ae358-9644-47ae-8afd-8d9d7402fca5",
								"d6d080c8-ef21-43d7-908b-f9d325c2e488"
							],
							"workload": "2.00:00:00",
							"memberId": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"progress": 0
						},
						{
							"id": "774200fb-97fe-497e-82e2-16d8d5f152e1",
							"kind": "task",
							"subject": "検証-要件C",
							"comment": "",
							"previous": [
								"351216b9-1a20-42ba-a325-2fa8b7b04f64"
							],
							"workload": "1.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						},
						{
							"id": "0e8bdc6c-f310-4a8a-8c15-6f92a6726a72",
							"kind": "task",
							"subject": "検証-要件D",
							"comment": "",
							"previous": [
								"1cad2b3e-88e2-4b95-8299-cb658951e5a9"
							],
							"workload": "1.00:00:00",
							"memberId": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"progress": 0
						},
						{
							"id": "47c3a953-65f5-40d0-b2ad-14fa7df546e3",
							"kind": "task",
							"subject": "検証-要件E",
							"comment": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"previous": [
								"774200fb-97fe-497e-82e2-16d8d5f152e1"
							],
							"workload": "4.00:00:00",
							"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
							"progress": 0
						},
						{
							"id": "d4dfe6da-e566-4d41-b1a2-0938f4fa869e",
							"kind": "task",
							"subject": "検証-要件F",
							"comment": "",
							"previous": [
								"0e8bdc6c-f310-4a8a-8c15-6f92a6726a72"
							],
							"workload": "3.00:00:00",
							"memberId": "7421f139-fd9a-420b-aa86-781ffbfd8113",
							"progress": 0
						}
					],
					"comment": ""
				},
				{
					"id": "0149365f-b0df-4fc0-b2f8-d6cdad2211c1",
					"kind": "task",
					"subject": "検証戻り対応A",
					"comment": "",
					"previous": [
						"e407fa61-333b-41b9-8c73-e4ca27dde33a"
					],
					"workload": "8.00:00:00",
					"memberId": "8beb418d-0523-4cff-8a3f-6fbc642e8f7b",
					"progress": 0
				},
				{
					"id": "0e2873e2-cf56-4549-b8b6-67de4550efd1",
					"kind": "task",
					"subject": "検証戻り対応B",
					"comment": "",
					"previous": [
						"e407fa61-333b-41b9-8c73-e4ca27dde33a"
					],
					"workload": "8.06:00:00",
					"memberId": "fef6751a-e7e6-4d4b-8d86-3b58448c83a3",
					"progress": 0
				}
			],
			"comment": ""
		},
		{
			"id": "9544ff54-d179-4814-9adf-1095ed418f48",
			"kind": "task",
			"subject": "納品",
			"comment": "",
			"previous": [
				"ded9cd24-5747-43f4-a129-c0a540a18843"
			],
			"workload": "2.00:00:00",
			"memberId": "f7294ba4-6775-4f07-a009-5b83231310c8",
			"progress": 0
		},
		{
			"id": "1be1308c-410c-4dc4-aada-4018ebcb84ac",
			"kind": "task",
			"subject": "お疲れ様",
			"comment": "",
			"static": Timelines.serializeDateTime(お疲れ様),
			"previous": [
				"9544ff54-d179-4814-9adf-1095ed418f48"
			],
			"workload": "1.00:00:00",
			"memberId": "",
			"progress": 0
		}
	]
		//--------------------------
		// eslint-disable-next-line semi-style
		;

	return setting;
}

