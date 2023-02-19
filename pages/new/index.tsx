import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import Layout from '@/components/layout/Layout'
import * as ISO8601 from '@/models/data/setting/ISO8601';
import * as Setting from '@/models/data/setting/Setting';
import { EditData } from '@/models/data/EditData';
import * as Goto from '@/models/Goto';

interface NewInput {
	title: string;
	dateFrom: ISO8601.Date;
	dateTo: ISO8601.Date;
}

const New: NextPage = () => {
	const router = useRouter();
	//const { register, handleSubmit, formState: { errors } } = useForm();
	const { register, handleSubmit, } = useForm<NewInput>();

	return (
		<Layout title='新規作成' mode='page' layoutId='new'>
			<p>ここで入力する内容は編集時に変更可能です。</p>

			<form onSubmit={handleSubmit(data => onSubmit(data, router))}>
				<dl className='inputs'>
					<dt>タイトル</dt>
					<dd>
						<input
							type='text'
							{...register("title", {
								required: {
									value: true,
									message: '必須'
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
								{...register('dateFrom', {
									required: {
										value: true,
										message: '必須'
									}
								})}
							/>
						</label>
						<span>～</span>
						<label>
							<input
								type='date'
								{...register('dateTo', {
									required: {
										value: true,
										message: '必須'
									}
								})}
							/>
							終了
						</label>
					</dd>
				</dl>

				<button className='action'>作業開始</button>
			</form>
		</Layout>
	);
};

export default New;

function onSubmit(data: NewInput, router: NextRouter) {
	console.debug(data);

	const fileName = 'new.json';
	const setting: Setting.Setting = {
		name: data.title,
		calendar: {
			holiday: {
				regulars: [
					'saturday',
					'sunday'
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
					'sunday': '#0000ff',
					'monday': '#ff0000',
				},
				events: {
					'holiday': '#f00',
					'special': '#f0f',
				}
			},
			groups: [
				'#00ff00',
				'#ffff00',
				'#00ffff',
			],
			end: '#000000',
		},
		timelines: [],
		versions: [],
	};

	console.debug(setting);
	console.debug(fileName);

	const editData: EditData = {
		fileName: fileName,
		setting: setting,
	};
	Goto.edit(editData, router);
}
