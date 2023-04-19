import classNames from "classnames";
import { NextPage } from "next";
import { useState } from "react";

import Icon from "@/components/elements/Icon";
import Overlay from "@/components/elements/Overlay";
import { TimelineKind } from "@/models/data/Setting";
import { IconKind } from "@/models/IconKind";

interface Props {
	currentTimelineKind: TimelineKind;
	disabled: boolean,
	moveItem: (moveUp: boolean) => void;
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

	function handleMoveItem(moveUp: boolean) {
		props.moveItem(moveUp);
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
			classNames(
				"timeline-cell timeline-controls",
				{
					"prompt": visibleControls
				}
			)
		}>
			<button
				className="cell"
				disabled={props.disabled}
				onClick={handleStartControls}
			>
				<Icon
					kind={IconKind.Operation}
				/>
			</button>
			<Overlay
				isVisible={visibleControls}
				callBackHidden={handleHideControls}
			>
				<div className="tools after">
					<table className="panel">
						<tbody>
							<tr>
								<th>移動</th>
								<td>
									<button
										className="simple"
										onClick={_ => handleMoveItem(true)}
									>
										<Icon
											kind={IconKind.MoveUp}
										/>
										上へ
									</button>
								</td>
								<td>
									<button
										className="simple"
										onClick={_ => handleMoveItem(false)}
									>
										<Icon
											kind={IconKind.MoveDown}
										/>
										下へ
									</button>
								</td>
							</tr>
							<tr>
								<th>
									追加
									(
									{
										props.currentTimelineKind === "group"
											? "終端"
											: "直近"
									}
									)
								</th>
								<td>
									<button
										className="simple"
										onClick={_ => handleAddItem("group")}
									>
										<Icon
											kind={IconKind.TimelineAddGroup}
										/>
										グループ
									</button>
								</td>
								<td>
									<button
										className="simple"
										onClick={_ => handleAddItem("task")}
									>
										<Icon
											kind={IconKind.TimelineAddTask}
										/>
										タスク
									</button>
								</td>
							</tr>
							<tr>
								<th>削除</th>
								<td></td>
								<td>
									<button
										className="simple"
										onClick={_ => handleDeleteItem()}
									>
										<Icon
											kind={IconKind.Remove}
										/>
										削除
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Overlay>
		</div>
	);
};

export default Component;
