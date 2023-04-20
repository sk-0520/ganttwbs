import { NextPage } from "next";

import Dialog from "@/components/elements/Dialog";
import { AnyTimeline } from "@/models/data/Setting";
import { useId, useState } from "react";
import { Editor } from "@monaco-editor/react";

interface Props {
	callback(timeline: AnyTimeline | null): void;
}

const Component: NextPage<Props> = (props: Props) => {

	const [subject, setSubject] = useState("新規タスク");
	const [contents, setContents] = useState("");

	let timeline: GroupTImeline | null = null;

	const id = {
		subject: useId(),
		contents: useId(),
	} as const;


	function handlePreSubmit(): boolean {
		return true;
	}

	function handleClose(isSubmit: boolean): void {
		if (!isSubmit) {
			props.callback(null);
			return;
		}

		props.callback(timeline);
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
						options={{
							insertSpaces: false,
						}}
					/>
				</dd>
			</dl>
		</Dialog>
	);
};

export default Component;
