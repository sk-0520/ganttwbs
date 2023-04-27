import classNames from "classnames";
import { FC, useState } from "react";

import { IconImage, IconKind } from "@/components/elements/Icon";
import Overlay from "@/components/elements/Overlay";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import { GroupTimeline, TimelineKind } from "@/models/data/Setting";
import { MoveDirection } from "@/models/store/TimelineStore";

interface Props {
	currentTimelineKind: TimelineKind;
	disabled: boolean,
	moveItem: (direction: MoveDirection) => void;
	addItem: (kindOrTimeline: TimelineKind | GroupTimeline) => void;
	deleteItem: () => void;
	showDetail(): void;
}

const ControlsCell: FC<Props> = (props: Props) => {
	const [visibleControls, setVisibleControls] = useState(false);
	const [visibleTimelinesImportDialog, setVisibleTimelinesImportDialog] = useState(false);

	function handleStartControls() {
		setVisibleControls(true);
	}
	function handleHideControls() {
		setVisibleControls(false);
	}

	function handleMoveItem(direction: MoveDirection) {
		props.moveItem(direction);
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

	function handleShowTimelinesImportDialog() {
		setVisibleTimelinesImportDialog(true);
		handleHideControls();
	}

	function handleCloseTimelinesImport(timeline: GroupTimeline | null) {
		if (timeline) {
			props.addItem(timeline);
		}

		setVisibleTimelinesImportDialog(false);
	}

	function handleShowDetail() {
		handleHideControls();
		props.showDetail();
	}

	return (
		<td className={
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
				<IconImage
					kind={IconKind.Operation}
				/>
			</button>
			<Overlay
				isVisible={visibleControls}
				callBackHidden={handleHideControls}
			>
				<div className="tools after">
					<table className="panel grid">
						<tbody>
							<tr>
								<th className="col-header">
									移動
								</th>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleMoveItem("up")}
									>
										<IconImage
											kind={IconKind.MoveUp}
										/>
										上へ
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleMoveItem("down")}
									>
										<IconImage
											kind={IconKind.MoveDown}
										/>
										下へ
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleMoveItem("parent")}
									>
										<IconImage
											kind={IconKind.MovePrev}
										/>
										下げる
									</button>
								</td>
							</tr>
							<tr>
								<th
									className="col-header"
									title={
										props.currentTimelineKind === "group"
											? "終端"
											: "直近"
									}
								>
									追加
								</th>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleAddItem("group")}
									>
										<IconImage
											kind={IconKind.TimelineAddGroup}
										/>
										グループ
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleAddItem("task")}
									>
										<IconImage
											kind={IconKind.TimelineAddTask}
										/>
										タスク
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleShowTimelinesImportDialog()}
									>
										<IconImage
											kind={IconKind.TimelineImport}
										/>
										一括
									</button>
								</td>
							</tr>
							<tr>
								<th className="col-header">
									その他
								</th>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleShowDetail()}
									>
										詳細設定
									</button>
								</td>
								<td className="col-cell" />
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleDeleteItem()}
									>
										<IconImage
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
			{visibleTimelinesImportDialog && (
				<TimelinesImportDialog
					callbackClose={handleCloseTimelinesImport}
				/>
			)}
		</td>
	);
};

export default ControlsCell;
