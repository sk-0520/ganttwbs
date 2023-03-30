import Overlay from "@/components/elements/Overlay";
import { TimelineKind } from "@/models/data/Setting";
import { NextPage } from "next";
import { useState } from "react";

export type MoveItemKind = "up" | "down";

interface Props {
	currentTimelineKind: TimelineKind;
	disabled: boolean,
	moveItem: (kind: MoveItemKind) => void;
	addItem: (kind: TimelineKind) => void;
	deleteItem: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	const [visibleControls, setVisibleControls] = useState(false);

	function handleStartControls() {
		setVisibleControls(true);
	}
	function handleHideControls() {
		setVisibleControls(false);
	}

	function handleMoveItem(kind: MoveItemKind) {
		props.moveItem(kind);
		handleHideControls();
	}

	function handleAddItem(kind: TimelineKind) {
		props.addItem(kind);
		handleHideControls();
	}

	function handleDeleteItem() {
		props.deleteItem();
		handleHideControls();
	}

	return (
		<div className={
			"timeline-controls"
			+ " " + (visibleControls ? " prompt" : "")
		}>
			<button
				disabled={props.disabled}
				onClick={handleStartControls}
			>
				操作
			</button>
			<Overlay
				isVisible={visibleControls}
				callBackHidden={handleHideControls}
			>
				<div className="tools after">
					<ul>
						<li>
							<button
								className="simple"
								onClick={_ => handleMoveItem("up")}>
								⬆️上へ移動
							</button >
						</li >
						<li>
							<button
								className="simple"
								onClick={_ => handleMoveItem("down")}>
								⬇️下へ移動
							</button>
						</li>
						<li>
							<button
								className="simple"
								onClick={_ => handleAddItem("group")}
							>
								{props.currentTimelineKind === "group" ? "📂" : "📁"}
								直下にグループ追加
							</button>
						</li>
						<li>
							<button
								className="simple"
								onClick={_ => handleAddItem("task")}
							>
								{props.currentTimelineKind === "group" ? "🐜" : "🐞"}
								直下にタスク追加
							</button>
						</li>
						<li>
							<button
								className="simple"
								onClick={_ => handleDeleteItem()}>
								🗑️削除
							</button>
						</li>
					</ul >
				</div>
			</Overlay>
		</div>
	)
};

export default Component;
