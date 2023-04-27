import { Editor } from "@monaco-editor/react";
import { FC, useState } from "react";

import Dialog from "@/components/elements/Dialog";
import { useLocale } from "@/locales/locale";
import { CssHelper } from "@/models/CssHelper";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { AnyTimeline, MemberId, Progress } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps {
	timeline: AnyTimeline;
	callbackSubmit(changedTimeline: AnyTimeline | null): void;
}

const TimelineDetailEditDialog: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const [subject, setSubject] = useState(props.timeline.subject);
	const [workload, setWorkload] = useState(Settings.maybeTaskTimeline(props.timeline) ? TimeSpan.parse(props.timeline.workload) : TimeSpan.zero);
	const [memberId, setMemberId] = useState<MemberId>(Settings.maybeTaskTimeline(props.timeline) ? props.timeline.memberId : "");
	const [progress, setProgress] = useState<Progress>(Settings.maybeTaskTimeline(props.timeline) ? props.timeline.progress : 0);
	const [comment, setComment] = useState(props.timeline.comment);

	const groups = [...props.setting.groups].sort((a, b) => a.name.localeCompare(b.name));

	function handleSubmit() {
		const editTimeline = {
			...props.timeline,
			subject,
			comment,
		};
		if (Settings.maybeTaskTimeline(editTimeline)) {
			editTimeline.workload = Timelines.serializeWorkload(workload);
			editTimeline.memberId = memberId;
			editTimeline.progress = progress;
		}

		props.callbackSubmit(editTimeline);
	}

	return (
		<Dialog
			button="submit"
			title="edit"
			callbackClose={type => {
				if (type === "submit") {
					handleSubmit();
				} else {
					props.callbackSubmit(null);
				}
			}}
		>
			<dl className="inputs timeline-editor">
				<dt>subject</dt>
				<dd>
					<input
						value={subject}
						onChange={ev => setSubject(ev.target.value)}
					/>
				</dd>

				{
					Settings.maybeTaskTimeline(props.timeline) && <>
						<dt>workload</dt>
						<dd>
							<input
								type="number"
								min={0}
								step={0.25}
								value={Timelines.displayWorkload(workload.totalDays)}
								onChange={ev => setWorkload(TimeSpan.fromDays(ev.target.valueAsNumber))}
							/>
						</dd>
					</>
				}

				{
					Settings.maybeTaskTimeline(props.timeline) && <>
						<dt>member</dt>
						<dd>
							<select
								value={memberId}
								onChange={ev => setMemberId(ev.target.value)}
							>
								<option value="">
									未設定
								</option>
								<>
									{
										groups.map(a => {
											return [...a.members]
												.sort((b, c) => b.name.localeCompare(c.name))
												.map(b => {
													return (
														<option key={b.id} value={b.id}>
															{a.name}: {b.name}
														</option>
													);
												});
										})
									}
								</>
							</select>
						</dd>
					</>
				}

				{
					Settings.maybeTaskTimeline(props.timeline) && <>
						<dt>progress</dt>
						<dd>
							<input
								type="number"
								min={0}
								max={100}
								step={1}
								value={Timelines.displayProgress(progress)}
								onChange={ev => setProgress(ev.target.valueAsNumber / 100.0)}
							/>
							<ul className="progress-fixed">
								<li>
									<button
										type="button"
										onClick={_ => setProgress(0)}
									>
										未対応
									</button>
								</li>
								<li className="range">
									<input
										type="range"
										min={0}
										max={1}
										step={0.01}
										value={progress}
										onChange={ev => setProgress(ev.target.valueAsNumber)}
									/>
								</li>
								<li>
									<button
										type="button"
										onClick={_ => setProgress(1)}
									>
										完了
									</button>
								</li>
							</ul>
						</dd>
					</>
				}

				<dt>comment</dt>
				<dd>
					<Editor
						width="100%"
						height="10em"
						value={comment}
						onChange={ev => setComment(ev ?? "")}
						options={{
							fontFamily: CssHelper.toFontFamily(locale.styles.editor.fontFamilies),
							lineNumbers: "off",
							quickSuggestions: false,
						}}
					/>
				</dd>
			</dl>
		</Dialog>
	);
};

export default TimelineDetailEditDialog;
