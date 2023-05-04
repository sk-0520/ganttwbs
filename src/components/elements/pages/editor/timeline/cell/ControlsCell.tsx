import classNames from "classnames";
import { FC, useState } from "react";

import { IconImage, IconKind, IconLabel } from "@/components/elements/Icon";
import Overlay from "@/components/elements/Overlay";
import TimelinesImportDialog from "@/components/elements/pages/editor/timeline/TimelinesImportDialog";
import { useLocale } from "@/locales/locale";
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
	const locale = useLocale();

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
					kind={IconKind.Option}
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
									{locale.pages.editor.timeline.timelines.controls.move.title}
								</th>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleMoveItem("up")}
									>
										<IconLabel
											kind={IconKind.MoveUp}
											label={locale.pages.editor.timeline.timelines.controls.move.up}
										/>
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleMoveItem("down")}
									>
										<IconLabel
											kind={IconKind.MoveDown}
											label={locale.pages.editor.timeline.timelines.controls.move.down}
										/>
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleMoveItem("parent")}
									>
										<IconLabel
											kind={IconKind.MovePrev}
											label={locale.pages.editor.timeline.timelines.controls.move.parent}
										/>
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
									{locale.pages.editor.timeline.timelines.controls.add.title}
								</th>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleAddItem("group")}
									>
										<IconLabel
											kind={IconKind.TimelineAddGroup}
											label={locale.pages.editor.timeline.timelines.controls.add.group}
										/>
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleAddItem("task")}
									>
										<IconLabel
											kind={IconKind.TimelineAddTask}
											label={locale.pages.editor.timeline.timelines.controls.add.task}
										/>
									</button>
								</td>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleShowTimelinesImportDialog()}
									>
										<IconLabel
											kind={IconKind.TimelineImport}
											label={locale.pages.editor.timeline.timelines.controls.add.import}
										/>
									</button>
								</td>
							</tr>
							<tr>
								<th className="col-header">
									{locale.pages.editor.timeline.timelines.controls.others.title}
								</th>
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleShowDetail()}
									>
										<IconLabel
											kind={IconKind.Edit}
											label={locale.pages.editor.timeline.timelines.controls.others.setting}
										/>
									</button>
								</td>
								<td className="col-cell" />
								<td className="col-cell">
									<button
										className="simple"
										onClick={_ => handleDeleteItem()}
									>
										<IconLabel
											kind={IconKind.Remove}
											label={locale.common.command.remove}
											/>
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
