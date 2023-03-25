import { TimelineKind } from "@/models/data/Setting";
import { NextPage } from "next";

export type MoveItemKind = "up" | "down";

interface Props {
	currentTimelineKind: TimelineKind;
	disabled: boolean,
	moveItem: (dir: MoveItemKind) => void;
	addItem: (dir: TimelineKind) => void;
	deleteItem: () => void;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<ul className="inline">
			<li>
				<button
					className="simple"
					disabled={props.disabled}
					onClick={_ => props.moveItem("up")}>
					⬆️
				</button>
			</li>
			<li>
				<button
					className="simple"
					disabled={props.disabled}
					onClick={_ => props.moveItem("down")}>
					⬇️
				</button>
			</li>
			<li>
				<button
					className="simple"
					disabled={props.disabled}
					onClick={_ => props.addItem("group")}
				>
					{props.currentTimelineKind === "group" ? "📂" : "📁"}
				</button>
			</li>
			<li>
				<button
					className="simple"
					disabled={props.disabled}
					onClick={_ => props.addItem("task")}
				>
					{props.currentTimelineKind === "group" ? "🐜" : "🐞"}
				</button>
			</li>
			<li>
				<button
					className="simple"
					disabled={props.disabled}
					onClick={_ => props.deleteItem()}>
					🗑️
				</button>
			</li>
		</ul>
	)
};

export default Component;
