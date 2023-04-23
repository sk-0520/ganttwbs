import { Editor } from "@monaco-editor/react";
import { FC, useId, useState } from "react";

import Dialog from "@/components/elements/Dialog";
import { useLocale } from "@/locales/locale";
import { Arrays } from "@/models/Arrays";
import { CssHelper } from "@/models/CssHelper";
import { GroupTimeline, TaskTimeline } from "@/models/data/Setting";
import { IdFactory } from "@/models/IdFactory";
import { Strings } from "@/models/Strings";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";

interface Props {
	callbackClose(timeline: GroupTimeline | null): void;
}

const TimelinesImportDialog: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const [subject, setSubject] = useState("新規タスク");
	const [contents, setContents] = useState("");

	const id = {
		subject: useId(),
		contents: useId(),
	} as const;


	function handlePreSubmit(): boolean {
		const lines = convertLines(contents);
		return 0 < lines.length;
	}

	function handleClose(isSubmit: boolean): void {
		if (!isSubmit) {
			props.callbackClose(null);
			return;
		}

		const groupTimeline: GroupTimeline = {
			id: IdFactory.createTimelineId(),
			kind: "group",
			comment: "",
			subject: subject,
			children: [],
		};

		const lines = convertLines(contents);

		for (const line of lines) {
			const taskTimeline: TaskTimeline = {
				id: IdFactory.createTimelineId(),
				kind: "task",
				comment: "",
				subject: line,
				memberId: "",
				previous: [],
				progress: 0,
				workload: Timelines.serializeWorkload(TimeSpan.fromDays(1)),
			};
			if (groupTimeline.children.length) {
				const prevTimeline = Arrays.last(groupTimeline.children);
				taskTimeline.previous.push(prevTimeline.id);
			}
			groupTimeline.children.push(taskTimeline);
		}

		props.callbackClose(groupTimeline);
	}


	return (
		<Dialog
			title="input"
			button="submit"
			preSubmit={handlePreSubmit}
			callbackClose={a => handleClose(a === "submit")}
		>
			<dl className="inputs">
				<dt>
					<label htmlFor={id.subject}>
						subject
					</label>
				</dt>
				<dd>
					<input
						id={id.subject}
						value={subject}
						onChange={ev => setSubject(ev.target.value)}
					/>
				</dd>

				<dt>
					<label htmlFor={id.contents}>
						contents
					</label>
				</dt>
				<dd>
					<Editor
						height={200}
						width={400}
						value={contents}
						onChange={ev => setContents(ev ?? "")}
						options={{
							lineNumbers: "on",
							minimap: {
								enabled: false
							},
							fontFamily: CssHelper.toFontFamily(locale.styles.editor.fontFamilies),
							quickSuggestions: false,
						}}
					/>
				</dd>
			</dl>
		</Dialog>
	);
};

export default TimelinesImportDialog;

function convertLines(contents: string) {
	return Strings.splitLines(contents)
		.map(a => Strings.trim(a))
		.filter(a => a)
		;
}
