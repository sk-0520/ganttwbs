import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Layout from "@/components/layout/Layout";
import { Goto } from "@/models/Goto";
import { EditData } from "@/models/data/EditData";
import { DateOnly, DefaultRecursiveMaxCount, Setting } from "@/models/data/Setting";
import { Strings } from "@/models/Strings";

interface Input {
	title: string;
	dateFrom: DateOnly;
	dateTo: DateOnly;
	mode: "template" | "empty";
}

const Page: NextPage = () => {
	const router = useRouter();
	//const { register, handleSubmit, formState: { errors } } = useForm();
	const { register, handleSubmit, } = useForm<Input>();

	const fromDate = new Date();
	const toDate = new Date(fromDate.getTime());
	toDate.setFullYear(toDate.getFullYear() + 1);

	return (
		<Layout title='新規作成' mode='page' layoutId='new'>
			<p>ここで入力する内容は編集時に変更可能です。</p>

			<form onSubmit={handleSubmit(data => onSubmit(data, router))}>
				<dl className='inputs'>
					<dt>タイトル</dt>
					<dd>
						<input
							type='text'
							/*DEBUG*/ defaultValue={new Date().toLocaleString()}
							{...register("title", {
								required: {
									value: true,
									message: "必須"
								}
							})}
						/>
					</dd>

					<dt>日付範囲</dt>
					<dd>
						<label>
							開始
							<input
								type='date'
								defaultValue={Strings.formatDate(fromDate, "yyyy-MM-dd")}
								{...register("dateFrom", {
									required: {
										value: true,
										message: "必須"
									}
								})}
							/>
						</label>
						<span>～</span>
						<label>
							<input
								type='date'
								defaultValue={Strings.formatDate(toDate, "yyyy-MM-dd")}
								{...register("dateTo", {
									required: {
										value: true,
										message: "必須"
									}
								})}
							/>
							終了
						</label>
					</dd>

					<dt>作成方法</dt>
					<dd>
						<ul className="inline">
							<li>
								<label>
									<input
										type="radio"
										value="template"
										/*DEBUG*/ checked={true}
										{...register("mode", {
											required: true
										})}
									/>
									てんぷれ
								</label>
							</li>
							<li>
								<label>
									<input
										type="radio"
										value="empty"
										{...register("mode", {
											required: true
										})}
									/>
									空データ
								</label>
							</li>
						</ul>
					</dd>
				</dl>

				<button className='action'>作業開始</button>
			</form>
		</Layout>
	);
};

export default Page;

function onSubmit(data: Input, router: NextRouter) {
	console.debug(data);

	const fileName = "new.json";
	let setting: Setting | null = null;

	switch (data.mode) {
		case "template":
			setting = createTemplateSetting(data);
			break;

		case "empty":
		default:
			setting = createEmptySetting(data);
			break;
	}

	console.debug(setting);
	console.debug(fileName);

	const editData: EditData = {
		fileName: fileName,
		setting: setting,
	};
	Goto.edit(editData, router);
}

function createEmptySetting(data: Input): Setting {
	const setting: Setting = {
		name: data.title,
		recursive: DefaultRecursiveMaxCount,
		calendar: {
			holiday: {
				regulars: [
					"saturday",
					"sunday"
				],
				events: {}
			},
			range: {
				from: data.dateFrom,
				to: data.dateTo
			},
		},
		theme: {
			holiday: {
				regulars: {
					"saturday": "#0000ff",
					"sunday": "#ff0000",
				},
				events: {
					"holiday": "#f00",
					"special": "#f0f",
				}
			},
			groups: [
				"#00ff00",
				"#ffff00",
				"#00ffff",
			],
			timeline: {
				group: "#ff00ff",
				defaultGroup: "#ff0000",
				defaultTask: "#00ff00",
				completed: "#000000"
			}
		},
		groups: [],
		timelineNodes: [],
		versions: [],
	};

	return setting;
}

function createTemplateSetting(data: Input): Setting {
	const setting: Setting = {
		name: data.title,
		recursive: DefaultRecursiveMaxCount,
		calendar: {
			holiday: {
				regulars: [
					"saturday",
					"sunday"
				],
				events: {}
			},
			range: {
				from: data.dateFrom,
				to: data.dateTo
			},
		},
		theme: {
			holiday: {
				regulars: {
					"saturday": "#0000ff",
					"sunday": "#ff0000",
				},
				events: {
					"holiday": "#f00",
					"special": "#f0f",
				}
			},
			groups: [
				"#00ff00",
				"#ffff00",
				"#00ffff",
			],
			timeline: {
				group: "#ff00ff",
				defaultGroup: "#ff0000",
				defaultTask: "#00ff00",
				completed: "#000000"
			}
		},
		"groups": [
			{
				"name": "a",
				"members": [
					{
						"id": "432c2338-fcba-4102-9068-5bc0d2afcc59",
						"name": "1",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					},
					{
						"id": "8a776768-782e-4a5e-a34b-03d6a75f8f4a",
						"name": "2",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					},
					{
						"id": "e0df9635-a45a-4fa7-98a1-636917d2bfea",
						"name": "3",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					}
				]
			},
			{
				"name": "b",
				"members": [
					{
						"id": "84397d4c-b318-40a7-b8e6-3241f01d45ee",
						"name": "11",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					},
					{
						"id": "904de269-90e5-4044-baf8-f48c0a0d3ad9",
						"name": "22",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					},
					{
						"id": "e9562e8b-0751-4c53-b12f-765455421aba",
						"name": "33",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					}
				]
			},
			{
				"name": "c",
				"members": [
					{
						"id": "ea8d0a7e-7f03-43f3-bd10-37ed6e28df21",
						"name": "XXX",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					},
					{
						"id": "df99b15d-024a-4b3e-9b75-8cf9b3e9e277",
						"name": "YYY",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					},
					{
						"id": "0e01addf-a633-4d60-a83a-f03bac40ec6e",
						"name": "ZZZ",
						"color": "#ff0",
						"price": {
							"cost": 40000,
							"sales": 50000
						}
					}
				]
			}
		],
		timelineNodes: [
			{
				"id": "66f15f2b-156d-44b5-9db8-76ba8105fb6e",
				kind: "group",
				subject: "",
				children: [
					{
						"id": "c5cfe379-fc55-4729-8b39-6f73378bcb96",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "3f13fa89-d719-4615-9f28-8ef9c61a9e35",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0.94
					},
					{
						"id": "00b88e7b-c1f5-4d74-9127-0847888181b8",
						kind: "group",
						subject: "",
						children: [
							{
								"id": "7818f2a5-3520-4c79-935e-1154be377aca",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "586dd968-08a8-4a15-a206-6b4a73626f90",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "a69c8073-346c-4e05-babc-0a2241bfb6fc",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							}
						],
						comment: ""
					},
					{
						"id": "27261fa7-a05a-4dc4-8aa1-16121fd81461",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "13.06:00:00",
						memberId: "",
						progress: 0.05
					}
				],
				comment: ""
			},
			{
				"id": "6ad7d477-a8b0-4335-9b8a-631e2e834aab",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0.11
			},
			{
				"id": "9895b5fc-5f6d-4000-8285-c9bace370a94",
				kind: "group",
				subject: "",
				children: [],
				comment: ""
			},
			{
				"id": "e862c9a4-9995-46f6-ba8f-3f97b4263455",
				kind: "group",
				subject: "",
				children: [],
				comment: ""
			},
			{
				"id": "1573a630-d3c7-4eab-b32b-ad44a3f5e26f",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0.06
			},
			{
				"id": "44c515b9-ceb6-4ede-86e6-39280473a56d",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0.83
			},
			{
				"id": "4c9e52f2-84a8-4167-9e52-62c940325bd5",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0.17
			},
			{
				"id": "a6637e96-3904-414c-a371-6a9b94e295d1",
				kind: "group",
				subject: "",
				children: [
					{
						"id": "edf4c949-781b-4c29-80ab-dcbc924aceb5",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.12:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "4af24085-f19d-459b-9580-f0c101523075",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0.05
					},
					{
						"id": "1004dcb1-7296-4bda-acf5-e0da24c66427",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "d4fa90cd-5bca-43a6-84e7-7429502c4dff",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0.5
					},
					{
						"id": "43719a48-e183-439c-8733-60c398ea0e76",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "79b654ea-b3c3-4fb8-8684-581ab818873b",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "f6c0dbed-7acd-4c80-a96b-809454c00706",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "0c157932-4c74-44f3-a489-820ca9b89b81",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "c49e98e8-2c76-4550-b9bc-c47d15ce96c2",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "032f2cb1-698d-45b8-b861-0f931fbeb55f",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "366285ee-5f83-4d44-9265-0ebf2930f046",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "b96be2b2-2efb-4361-ad8b-01110b10c7b4",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "6c983b26-986b-45af-b322-a67e242a3b52",
						kind: "group",
						subject: "",
						children: [
							{
								"id": "3da686ce-0492-4a4b-b416-dbfab4201ea3",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 0.05
							},
							{
								"id": "3334d523-3aac-4df5-a29e-18e2c6495486",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 0.06
							},
							{
								"id": "e6e73786-4a73-4246-848c-7691d56d9718",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 0.56
							}
						],
						comment: ""
					},
					{
						"id": "8020fe75-b130-4743-aa47-d399222f7af9",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "eb0b0d32-6456-41a4-b5d9-fe3c790f2dbe",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "5cfcff13-d893-484b-ae0d-a8ff3cf11620",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "616ca684-c88e-4331-9666-6691606283aa",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					}
				],
				comment: ""
			},
			{
				"id": "e89edd2f-6271-4e5e-bce0-b9dd8c820ac3",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0.14
			},
			{
				"id": "3b2e5354-7ed9-4441-ac21-956fd8363043",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0
			},
			{
				"id": "d962b018-d24e-44f6-9b07-4ae1e60fbf4d",
				kind: "group",
				subject: "",
				children: [
					{
						"id": "2c222f11-ebc9-4b8a-8f54-dc15d90ab4f4",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0.59
					},
					{
						"id": "4cff8411-cc90-41c2-b862-e0e2bdcdcd1d",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 1
					},
					{
						"id": "0b2fd4a3-9739-4dd3-8060-7d29e2c5f62f",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "713168ed-bb13-4a04-bb91-eac9e2b706f8",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "a7578e7c-4fa6-4039-91fb-5634fb32f5be",
						kind: "group",
						subject: "",
						children: [
							{
								"id": "4ba33a62-e855-4b59-bad9-5a69f3960b22",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "1e066543-a11a-4a48-b4a1-cbc3d987175c",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "50f6d501-732a-4165-b60d-1b4d6a504b74",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 0.19
							},
							{
								"id": "db5af355-2976-4833-9e49-ff8ba0c515e2",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "73c82ab6-24f3-406f-aba0-6ee49d93524c",
								kind: "group",
								subject: "",
								children: [
									{
										"id": "9686cf4b-acf9-4c49-9489-5e013db48f50",
										kind: "task",
										subject: "",
										comment: "",
										previous: [],
										workload: "1.00:00:00",
										memberId: "",
										progress: 1
									}
								],
								comment: ""
							},
							{
								"id": "65b7b361-083f-4e54-ab35-b503ebbdd731",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "154b1749-59c6-4e42-ba17-d7cc460648d7",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							},
							{
								"id": "88e49a5c-0f8d-478b-922b-24e1d7a0531d",
								kind: "task",
								subject: "",
								comment: "",
								previous: [],
								workload: "1.00:00:00",
								memberId: "",
								progress: 1
							}
						],
						comment: ""
					},
					{
						"id": "5bbaaf0c-54af-4bd6-82ca-83b7aee6e383",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "a3a1b3ee-4151-459b-9486-c7de10dff961",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "d6867355-5240-4adc-9d33-aea38b451f1c",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "9ed6c0ab-d36d-40f9-b25b-facae8547ec1",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					},
					{
						"id": "8cf4b8fe-95d9-4d1e-8cb7-c2c6621f77c6",
						kind: "task",
						subject: "",
						comment: "",
						previous: [],
						workload: "1.00:00:00",
						memberId: "",
						progress: 0
					}
				],
				comment: ""
			},
			{
				"id": "4075552a-6c86-455e-8a8b-cb27da41bf21",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "18:00:00",
				memberId: "",
				progress: 0.05
			},
			{
				"id": "0225341c-823f-4751-853c-c07ced50a5b4",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0.47
			},
			{
				"id": "805473cb-df4b-4c6d-b104-d60ca5a0d758",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0
			},
			{
				"id": "47d3011a-db3b-4433-ba01-71f6bd5a4cf8",
				kind: "task",
				subject: "",
				comment: "",
				previous: [],
				workload: "1.00:00:00",
				memberId: "",
				progress: 0
			}
		],
		versions: [],
	};

	return setting;
}

