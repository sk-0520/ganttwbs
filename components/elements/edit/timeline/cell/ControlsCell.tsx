import { TimelineKind } from "@/models/data/Setting";
import { NextPage } from "next";
import { useState } from "react";

export type MoveItemKind = "up" | "down";

interface Props {
	currentTimelineKind: TimelineKind;
	disabled: boolean,
	moveItem: (dir: MoveItemKind) => void;
	addItem: (dir: TimelineKind) => void;
	deleteItem: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const [visibleControls, setVisibleControls] = useState(false);

	function handleStartControls() {
		setVisibleControls(true);
	}

	return (
		<div className={
			"timeline-controls"
			+ " " + (visibleControls ? " prompt" : "")
		}>
			<button
				onClick={handleStartControls}
			>
				CTRL
			</button>
			{visibleControls && (
				<>
					<div className="tools after">
						<ul>
							<li>
								<button
									className="simple"
									disabled={props.disabled}
									onClick={_ => props.moveItem("up")}>
									⬆️上へ移動
								</button >
							</li >
							<li>
								<button
									className="simple"
									disabled={props.disabled}
									onClick={_ => props.moveItem("down")}>
									⬇️下へ移動
								</button>
							</li>
							<li>
								<button
									className="simple"
									disabled={props.disabled}
									onClick={_ => props.addItem("group")}
								>
									{props.currentTimelineKind === "group" ? "📂" : "📁"}
									直下にグループ追加
								</button>
							</li>
							<li>
								<button
									className="simple"
									disabled={props.disabled}
									onClick={_ => props.addItem("task")}
								>
									{props.currentTimelineKind === "group" ? "🐜" : "🐞"}
									直下にタスク追加
								</button>
							</li>
							<li>
								<button
									className="simple"
									disabled={props.disabled}
									onClick={_ => props.deleteItem()}>
									🗑️削除
								</button>
							</li>
						</ul >
					</div>
				</>
			)}
		</div>
	)
};

export default Component;
